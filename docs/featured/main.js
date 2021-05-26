const base = 'https://testausserveri.fi/';

class Cards {
    constructor(data, selector) {
        this.data = data;
        this.target = document.querySelector(selector);
        console.log(this.target, selector)
        this.render();
    }
    render() {
        this.data.forEach((item, i) => {
            let domItem;
            if (item.url) {
                domItem = document.createElement('a');
                domItem.href = item.url + '?utm_source=testausserveri&utm_medium=homepage&utm_campaign=projects'; // append some analytic magic
                domItem.setAttribute('rel', 'noopener noreferrer');
                domItem.setAttribute('target', '_blank');
            } else {
                domItem = document.createElement('li');
            }
    
            domItem.className = 'item splide__slide';
    
            if (item.video) {
                let domBackground = document.createElement('video');
                domBackground.setAttribute('poster', base + item.image);
                domBackground.autoplay = true;
                domBackground.loop = true;
                domBackground.muted = true;
                domBackground.setAttribute('playsinline', '');
                domBackground.className = 'itemBackground';
                domBackground.id = 'bg' + i;
                let domBackgroundSource = document.createElement('source');
                domBackgroundSource.setAttribute('src', base + item.video);
                domBackgroundSource.setAttribute('type', 'video/mp4');
                domBackground.appendChild(domBackgroundSource);
                domItem.appendChild(domBackground);
            } else {
                let domBackground = document.createElement('div');
                domBackground.className = 'itemBackground';
                domBackground.style['background-image'] = 'url(\'' + base + item.image + '\')'
                domItem.appendChild(domBackground);
            }
            
    
            let domContent = document.createElement('div');
            domContent.className = 'itemContent';
            
            domContent.onclick = () => {document.querySelector('#bg' + i).play();};
            let domContentBig = document.createElement('div');
            domContentBig.className = 'CBig';
    
            let domTitle = document.createElement('h3');
            domTitle.className = 'piTitle';
            domTitle.innerHTML = item.name;
    
            let domDesc = document.createElement('span');
            domDesc.className = 'piOrg';
            domDesc.innerHTML = (item.desc ? item.desc.replace(/\n/g, '<br>') : item.real)
            domContentBig.appendChild(domTitle);
            domContentBig.appendChild(domDesc);
            if (item.additionalCardHtml) {
                let domContentSmall = document.createElement('div');
                domContentSmall.innerHTML = item.additionalCardHtml;
                domContent.appendChild(domContentSmall);
            }
    
            domContent.appendChild(domContentBig);
            domItem.appendChild(domContent);

            this.target.appendChild(domItem);
        })
    }
}

fetch('https://testausserveri.fi/projects.json', {mode: 'cors'})
.then(res => res.json())
.then(({ projects }) => {
    new Cards(projects, "#cards")
    
    new Splide( '#slideshow', {
        type   : 'loop',
        padding: {
            right: '5rem',
            left : '5rem',
            bottom: '5rem',
        },
        fixedWidth: "70vw",
        audoWidth: false,
        autoplay: true,
        interval: 15000,
        pauseOnHover: false,
        pauseOnFocus: false,
        perPage: 1,
        focus: "center"
    } ).mount();
})