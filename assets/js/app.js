// 1. slideshow
const albumList = document.querySelector(".inner-abum__list");
const albumImages = document.querySelectorAll(".inner-abum__img");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("pre-btn");
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let currentIndex = 0;

function updateSlide() {
    const offset = -currentIndex * 39.4;
    albumList.style.transform = `translateX(${offset}%)`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % albumImages.length;
    updateSlide();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + albumImages.length) % albumImages.length;
    updateSlide();
}

nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);

updateSlide();

// 2. control buttons
const playlist = $(".inner-play__list");
const heading = $(".cd__inner-title");
const author = $(".cd__inner-author");
const audio = $("#audio");
const songImage = $(".cd__avatar");
const playBtn = $(".btn-toggle-play");
const player = $(".control");
const next = $(".btn-next");
const prev = $(".btn-prev");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Nếu em còn tồn tại",
            singer: "Trịnh Đình Quang",
            path: "./assets/music/neuemcontontai.mp3",
            image: "./assets/imgs/neuemcontontai.jpg",
        },
        {
            name: "Thất tình",
            singer: "Trịnh Đình Quang",
            path: "./assets/music/thattinh.mp3",
            image: "./assets/imgs/thattinh.jpg",
        },
        {
            name: "Ngỡ",
            singer: "Quang Hà",
            path: "./assets/music/ngo.mp3",
            image: "./assets/imgs/ngo.jpg",
        },
        {
            name: "Nỗi đau xót xa",
            singer: "Minh Vương",
            path: "./assets/music/noidauxotxa.mp3",
            image: "./assets/imgs/noidauxotxa.jpg",
        },
        {
            name: "Trăm năm không quên",
            singer: "Quang Hà",
            path: "./assets/music/tramnamkhongquen.mp3",
            image: "./assets/imgs/tramnamkhongquen.jpg",
        },
        {
            name: "Tòng phu",
            singer: "KEYO",
            path: "./assets/music/tongphu.mp3",
            image: "./assets/imgs/tongphu.jpg",
        },
    ],

    // 1. Render HTML
    render: function () {
        const html = this.songs.map((song, index) => {
            return `<div class="inner-song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                        <span class="inner-song__number">${index}</span>
                        <div class="inner-song__media">
                        <img src="${song.image}" alt="" class="inner-song__avatar" />
                        </div>
                            <div class="inner-song__body">
                                <p class="inner-song__name">${song.name}</p>
                                <p class="inner-song__author">${song.singer}</p>
                            </div>
                        <div class="inner-song__option">
                            <img class="inner-song__icon" src="./assets/icons/option.svg" alt="" />
                            </div>
                        </div>`;
        });
        playlist.innerHTML = html.join("");
    },

    // 2. Tạo thuộc tính current song
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    // 3. Tải thông tin bài hát hiện tại
    loadCurrentSong: function () {
        songImage.src = this.currentSong.image;
        heading.textContent = this.currentSong.name;
        author.textContent = this.currentSong.singer;
        audio.src = this.currentSong.path;
    },

    // 4. Xử lý sự kiện
    handleEvents: function () {
        const _this = this;
        const cdAvatar = $(".cd__avatar");

        const cdAnimate = cdAvatar.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        });
        cdAnimate.pause();

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdAnimate.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdAnimate.pause();
        };

        // 4.1. Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // 5. Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // 6. Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // 7. Xử kiện click vô bài hát sẽ chạy
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".inner-song:not(.active");
            if (songNode) {
                if (songNode) {
                    _this.currentIndex = parseInt(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };

        // 8. Xử lý khi next
        next.onclick = function (e) {
            _this.nextSong();
            audio.play();
            _this.render();
        };

        // 9. Xử lý nút prev
        prev.onclick = function (e) {
            _this.prevSong();
            audio.play();
            _this.render();
        };

        // 10. Xử lý next song khi audio ended
        audio.onended = function () {
            next.click();
        };
    },

    // 5. Next bài hát
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // 6. Prev bài hát
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // Star app
    start: function () {
        this.render();
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvents();
    },
};

app.start();
