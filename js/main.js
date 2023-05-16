function creteliElement(music, index, musicList, play, audio) {
  const liElement = document
    .getElementById("template")
    .content.firstElementChild.cloneNode(true);
  liElement.querySelector(".play-list__item-img").src = music.image;
  liElement.querySelector(".play-list__item-name").textContent = music.name;
  liElement.querySelector(".play-list__item-author").textContent = music.singer;
  liElement.dataset.id = index;
  if (index === play.currentMusic) {
    liElement.classList.add("active");
  }

  liElement.addEventListener("click", (e) => {
    if (liElement.classList.contains("active")) return;
    const settingMusic = liElement.querySelector(".play-list__item-setting");
    if (settingMusic.contains(e.target)) return;
    // console.log(e.target);
    play.currentMusic = index;
    initAcitveMusic(play);
    updateCurrentMusic(play, musicList);
    initCurrentMusicModal(play, musicList);
    audio.play();
  });
  return liElement;
}

function initAcitveMusic(play) {
  const liList = document.querySelectorAll(".play-list__item");
  liList.forEach((li) => {
    li.classList.remove("active");
  });
  liList[play.currentMusic].classList.add("active");
}

function initCurrentMusicModal(play, musicList) {
  const modalImg = document.querySelector(".modal__body-img");
  const modalName = document.querySelector(".modal__des-name");
  const modalSinger = document.querySelector(".modal__des-singer");
  modalImg.src = musicList[play.currentMusic].image;
  modalName.textContent = musicList[play.currentMusic].name;
  modalSinger.textContent = musicList[play.currentMusic].singer;
}

function updateCurrentMusic(play, musicList) {
  document.querySelector(".player__info-img").src =
    musicList[play.currentMusic].image;
  document.querySelector(".play-list__item-info-name").textContent =
    musicList[play.currentMusic].name;
  document.querySelector(".play-list__item-info-author").textContent =
    musicList[play.currentMusic].singer;
  audio.src = musicList[play.currentMusic].path;
}

function animateCd() {
  const cdThumb = document.querySelector(".modal__body-img");
  const animation = [{ transform: "rotate(360deg)" }];
  const cdThumbRotate = cdThumb.animate(animation, {
    duration: 5000,
    iterations: Infinity,
  });
  cdThumbRotate.pause();
  return cdThumbRotate;
}

function animateModalShow(modal) {
  const animation = [{ transform: "translateY(0)" }];
  const modalThumbRotate = modal.animate(animation, {
    duration: 500,
    fill: "forwards",
  });
  modalThumbRotate.pause();
  return modalThumbRotate;
}

function animateModalHide(modal) {
  console.log(modal);
  const animation = [{ transform: "translateY(100%)" }];
  const modalThumbRotate = modal.animate(animation, {
    duration: 500,
    fill: "forwards",
  });
  modalThumbRotate.pause();
  return modalThumbRotate;
}

/**
 * render music ok👌
 * update first music ok👌
 * set current time in input range ok👌
 * handle next/ prev music ok👌
 * handle next music when ended ok👌
 * repeat, random music ok👌
 * handle click music ok👌
 * handle next active music ok👌
 * li has look ok👌
 * click move tab ok👌
 * modal play music
 */

function renderMusicList(musicList, play, audio) {
  const ulList = document.querySelector(".play-list");
  musicList.forEach((music, index) => {
    const liElement = creteliElement(music, index, musicList, play, audio);
    ulList.appendChild(liElement);
  });
}

function handleEventPlayBtn(audio, play) {
  // if (play.isPlaying) {
  //   audio.pause();
  // } else {
  //   audio.play();
  // }
  play.isPlaying ? audio.pause() : audio.play();
}

function handleRandomMusic(play, musicList, musicPlay) {
  let randomMusic;
  do {
    randomMusic = Math.floor(Math.random() * (musicList.length - 1));
  } while (
    randomMusic === play.currentMusic ||
    musicPlay.includes(randomMusic)
  );
  musicPlay.push(randomMusic);
  play.currentMusic = randomMusic;
  if (musicPlay.length === musicList.length - 1) {
    musicPlay = [];
  }
}

function scrollIntoView() {
  const active = document.querySelector(".play-list__item.active");
  setTimeout(() => {
    active.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, 300);
}

function initPlayMusic(audio, play, musicList, musicPlay) {
  const cdThumbRotate = animateCd();
  //handle click btn play
  const playBtn = document.querySelector(".player__play-play");
  playBtn.addEventListener("click", (e) => {
    handleEventPlayBtn(audio, play);
  });
  //handle audio when play
  audio.onplay = function () {
    play.isPlaying = true;
    playBtn.classList.add("run");
    cdThumbRotate.play();
  };
  //handle audio when pause
  audio.onpause = function () {
    play.isPlaying = false;
    playBtn.classList.remove("run");
    cdThumbRotate.pause();
  };
  //handle next music when ended
  audio.onended = function () {
    // if (play.isRepeat) audio.play();
    play.isRepeat ? audio.play() : nextBtn.click();
  };
  //time update
  const inputRange = document.querySelector(".player__play-input");
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const percentTime = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      inputRange.value = percentTime;
    }
  });
  //handle change input
  inputRange.addEventListener("input", () => {
    const currentTimeMusic = (inputRange.value / 100) * audio.duration;
    audio.currentTime = currentTimeMusic;
  });
  //handle next music
  const nextBtn = document.querySelector(".player__play-next");
  nextBtn.addEventListener("click", () => {
    //if random
    if (play.isRandom) {
      handleRandomMusic(play, musicList, musicPlay);
    } else {
      play.currentMusic++;
      if (play.currentMusic >= musicList.length) {
        play.currentMusic = 0;
      }
    }
    initAcitveMusic(play);
    updateCurrentMusic(play, musicList);
    initCurrentMusicModal(play, musicList);
    scrollIntoView();
    audio.play();
  });

  //handle prev music
  const prevBtn = document.querySelector(".player__play-prev");
  prevBtn.addEventListener("click", () => {
    if (play.isRandom) {
      handleRandomMusic(play, musicList, musicPlay);
    }
    play.currentMusic--;
    if (play.currentMusic < 0) {
      play.currentMusic = musicList.length - 1;
    }
    initAcitveMusic(play);
    updateCurrentMusic(play, musicList);
    initCurrentMusicModal(play, musicList);
    scrollIntoView();
    audio.play();
  });

  //handle togggle repeat music
  const repeatBtn = document.querySelector(".player__play-repeat");
  repeatBtn.addEventListener("click", (e) => {
    play.isRepeat = !play.isRepeat;
    e.currentTarget.classList.toggle("repeat", play.isRepeat);
  });
  //handle toggle random music
  const randomBtn = document.querySelector(".player__play-random");
  randomBtn.addEventListener("click", (e) => {
    play.isRandom = !play.isRandom;
    e.currentTarget.classList.toggle("random", play.isRandom);
  });
}

function initVolumeMusic(audio) {
  const inputVolume = document.querySelector(".player__setting-range");
  inputVolume.addEventListener("input", (e) => {
    audio.volume = inputVolume.value;
  });
}

function initScrollWindow() {
  window.addEventListener("scroll", () => {
    const head = document.querySelector(".container__head");
    if (document.documentElement.scrollTop > 0) {
      head.style.backgroundColor = "#37075d";
    } else {
      head.style.backgroundColor = "transparent";
    }
  });
}
//navbar
function initSelectNavBar() {
  const navLink = document.querySelectorAll(".nav-bar__link");
  navLink.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });

  const navList = document.querySelectorAll('[data-nav ="select"]');
  const bodyList = document.querySelectorAll('[data-id="body-select"]');
  navList.forEach((nav, index) => {
    nav.addEventListener("click", (e) => {
      navList.forEach((n) => n.classList.remove("active"));
      e.currentTarget.classList.add("active");

      bodyList.forEach((body) => body.classList.remove("active"));
      bodyList[index].classList.add("active");
    });
  });
}

function handleShowModal(e, player, playerPlay, playerSetting, modal) {
  if (playerPlay.contains(e.target) || playerSetting.contains(e.target)) return;
  const animateShow = animateModalShow(modal);
  animateShow.play();
}

//modal
function initHandleModal() {
  const player = document.querySelector(".player");
  const playerPlay = document.querySelector(".player__play");
  const playerSetting = document.querySelector(".player__setting");
  const down = document.querySelector(".modal__dow");
  const modal = document.querySelector(".modal");

  player.addEventListener("click", (e) => {
    handleShowModal(e, player, playerPlay, playerSetting, modal);
  });

  down.addEventListener("click", (e) => {
    const animateHide = animateModalHide(modal);
    animateHide.play();
  });
}

(() => {
  const musicPlay = [];
  const play = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentMusic: 0,
  };
  const audio = document.querySelector("#audio");

  const musicList = [
    {
      name: "Chỉ Một Đêm Nữa Thôi",
      singer: "MCK",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Buâng Khuâng",
      singer: "Justatee",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Tiền Nhiều Để Làm Gì",
      singer: "GDucky",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Đã Lỡ Yêu Em Nhiều",
      singer: "Justatee",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Nơi Này Có Anh",
      singer: "Sơn Tùng",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Là Em, Chính Là Em",
      singer: "Dương Domic",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Hãy Trao Cho Anh",
      singer: "Sơn Tùng",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "Chúng Ta Không Thuộc Về Nhau",
      singer: "Sơn Tùng",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Em Của Ngày Hôm Qua",
      singer: "Sơn Tùng",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.png",
    },
    {
      name: "Một Năm Mới Bình An",
      singer: "Sơn Tùng",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
    },
    {
      name: "Nếu Em Còn Tồn Tại",
      singer: "Trịnh Đình Quang",
      path: "./assets/music/song11.mp3",
      image: "./assets/img/song11.jpg",
    },
    {
      name: "Thế Giới Ảo Tình Yêu Thật",
      singer: "Trình Đình Quang",
      path: "./assets/music/song12.mp3",
      image: "./assets/img/song12.jpg",
    },
  ];
  renderMusicList(musicList, play, audio);
  updateCurrentMusic(play, musicList, audio);
  initPlayMusic(audio, play, musicList, musicPlay);
  initCurrentMusicModal(play, musicList);
  initVolumeMusic(audio);
  initScrollWindow();
  initSelectNavBar();
  initHandleModal();
})();
