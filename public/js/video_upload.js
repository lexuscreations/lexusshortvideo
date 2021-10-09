const form = document.querySelector("#video-upload-form")
const fileInput = document.querySelector(".file-input")
const progressArea = document.querySelector(".progress-area")
const uploadedArea = document.querySelector(".uploaded-area")
const submitBtn = document.querySelector("#submit")
const customMessage = document.querySelector('#message')

$('.formSelectTriger').click(e => fileInput.click())

const onSubmit = e => {
    e.preventDefault()
    if (validateForm()) uploadVideo()
}

const validateForm = () => {
    const uploadedFile = form.elements[0].files[0]
    const fileLimit = 104857600

    if (!uploadedFile) {
        customMessage.innerHTML = "Please Select A Short Video To Upload!"
        customMessage.style.color = "#dc3545"
        return false
    }
    if (uploadedFile.size > fileLimit) {
        customMessage.innerHTML = "Maximum Video Size Allowed: 100MB!"
        customMessage.style.color = "#ffc108"
        return false
    }

    return true
}

const uploadVideo = () => {
    submitBtn.style.display = "none"
    $(".textareaDetailCon").css({ display: "none" })
    customMessage.innerHTML = 'Uploading Video..'

    const request = new XMLHttpRequest()
    request.open("POST", "/", true)

    request.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileLoaded = Math.floor((loaded / total) * 100)
        let fileTotal = Math.floor(total / 1000)

        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB": fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB"

        let progressHTML = `
            <li class="row shadow rounded">
                <i class="fas fa-file-alt" style="width: 0 !important;"></i>
                <div class="content">
                    <div class="details">
                        <span class="name">${name} • Uploading</span>
                        <span class="percent">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${fileLoaded}%"></div>
                    </div>
                </div>
            </li>
        `
        uploadedArea.classList.add("onprogress")
        progressArea.innerHTML = progressHTML

        if (loaded == total) {
            progressArea.innerHTML = ""
            let uploadedHTML = `
            <li class="row shadow rounded">
                <div class="content upload">
                    <span class="d-flex align-items-center justify-content-between">
                        <i class="fas fa-file-alt"></i>
                        <div class="details">
                            <span class="name">${name} • Uploaded</span>
                            <span class="size">${fileSize}</span>
                        </div>
                    </span>
                    <i class="fas fa-check mt-1"></i>
                </div>
            </li>
            `
            uploadedArea.classList.remove("onprogress")
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML)
        }
    })

    request.upload.onprogress = fileUploadPercentage

    request.onload = onComplete

    const data = new FormData(form)
    request.send(data)
}

const onComplete = event => {
    const response = JSON.parse(event.currentTarget.response)
    if (response.success) {
        customMessage.style.color = '#9C27B0'
        customMessage.innerHTML = 'Video Uploaded successfully!!.<br/>Please <a href=' + response.link + '>click here</a> to view the video.'
    } else {
        customMessage.innerHTML = response.error
        customMessage.style.color = 'red'
    }
    // submitBtn.style.display = "block"
}

const fileUploadPercentage = e => {
    if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100
        customMessage.innerHTML = 'Uploading Video: ' + parseFloat(percentage).toFixed(2) + ' %'
    }
}

$('input[type=file]').change(function(e) {
    $(".videoSelectArea div").css({ display: "none" })
    $(".videoSelectArea").append(`
        <div>
            size: ${parseFloat($(this)[0].files[0].size / 1e+6).toFixed(2) + " MB"}</br>
            name: ${$(this)[0].files[0].name}</br>
            type: ${$(this)[0].files[0].type}</br>
            <span style="cursor: pointer;color: blue;" onclick="window.location.reload()">Upload Another One?</span>
            </br>
            </br>
        </div>
    `)
})