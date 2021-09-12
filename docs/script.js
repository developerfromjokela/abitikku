const platformIcons = {
    exe: "fa-windows",
    app: "fa-apple",
    deb: "fa-ubuntu",
    rpm: "fa-linux",
    appImage: "fa-linux"
}

// what the fuck is style of the following code
// burn it 😭
function updateLinks(version, downloadLinks) {
    Sniffr.sniff(window.navigator.userAgent);
    let osInfo = Sniffr.os;
    let url = downloadLinks.exe;
    let nameInfo = "Lataa ";
    let icon = "fa-windows";

    if (osInfo.name === "linux") {
        url = downloadLinks.appImage,
            icon = platformIcons.appImage;

        if (window.navigator.userAgent.toLowerCase().includes("ubuntu") ||  window.navigator.userAgent.toLowerCase().includes("deb")) {
            url = downloadLinks.deb,
                icon = platformIcons.deb,
                nameInfo += "Abitikku, Ubuntu/Debian (.deb)";
        } else if (window.navigator.userAgent.toLowerCase().includes("arch")) {
            url = downloadLinks.rpm,
                icon = platformIcons.rpm,
                nameInfo += "Abitikku, Arch (.rpm)";
        } else {
            url = downloadLinks.appImage,
                icon = platformIcons.appImage,
                nameInfo += "Abitikku, Linux (.AppImage)";
        }
    } else if (osInfo.name === "windows") {
        url = downloadLinks.exe,
            icon = platformIcons.exe,
            nameInfo += "Windowsille";
    } else if (osInfo.name === "macos") {
        url = downloadLinks.app,
            icon = platformIcons.app,
            nameInfo += "macOS:lle";
    }
    

    let downloadText = document.getElementById("downloadText");
    let downloadLink = document.getElementById("downloadLink");
    let versionText = document.getElementById("versionText");
    let downloadIcon = document.querySelector(".fab");

    downloadIcon.className = `fab ${icon}` // clearing out the initial icon
    
    downloadLink.href = url;
    downloadText.innerHTML = nameInfo;
    versionText.innerHTML = `Abitikun uusin julkaistu versio on ${version}.`;
}

fetch("https://api.github.com/repos/testausserveri/abitikku/releases/latest")
    .then(res => res.json())
    .then(({ tag_name, assets }) => {
        if (!assets) alert("Valitettavasti versioiden hakeminen epäonnistui. Pyydämme sinua ottamaan yhteyttä Abitikun tukeen.")

        let downloadLinks = {
            exe: assets.find(asset => asset.name.includes("Setup"))["browser_download_url"],
            app: assets.find(asset => asset.name.endsWith(".app.zip"))["browser_download_url"],
            deb: assets.find(asset => asset.name.endsWith(".deb"))["browser_download_url"],
            rpm: assets.find(asset => asset.name.endsWith(".rpm"))["browser_download_url"],
            appImage: assets.find(asset => asset.name.endsWith(".AppImage"))["browser_download_url"]
        }

        console.log(`Found the following download links from the latest release (${tag_name})`, downloadLinks)

        updateLinks(tag_name, downloadLinks)
    })
