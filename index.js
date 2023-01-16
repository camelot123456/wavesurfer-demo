const audioDatabase = [
  {
    name: "audio1",
    source: "./audios/WAV_1MG.wav",
  },
  {
    name: "audio2",
    source: "./audios/WAV_2MG.wav",
  },
  {
    name: "audio3",
    source: "./audios/WAV_5MG.wav",
  },
  {
    name: "audio4",
    source: "./audios/WAV_10MG.wav",
  },
];

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const pausePlayBtn = $("#pause-play-btn");
const stopBtn = $("#stop-btn");
const stepForwardBtn = $("#step-forward-btn");
const stepBackwardBtn = $("#step-backward-btn");
const forwardBtn = $("#forward-btn");
const backwardBtn = $("#backward-btn");
const volumeRange = $("#volume-range");
const zoomRange = $("#zoom-range");
const volumeBtn = $("#volume-btn");
const autoCenterBtn = $("#auto-center-btn");
const audioRate = $("#audio-rate");
let songIndex = 0;

let wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "green",
  progressColor: "purple",
  backgroundColor: "light",
  cursorColor: 'red',
  cursorWidth: 1,
  barGap: 1,
  barWidth: null,
  audioRate: 1,
  height: 128,
  hideScrollbar: false,
  hideCursor: false,
  interact: false,
  loopSelection: true,
  scrollParent: true,
  splitChannels: true,
  responsive: true,
  mediaControls: true,
  skipLength: 2,
  plugins: [
    WaveSurfer.regions.create({
      dragSelection: {
        slop: 5
      }
    }),
    WaveSurfer.timeline.create({
      container: '#wave-timeline'
    }),
    WaveSurfer.cursor.create({
      showTime: true
    }),
    WaveSurfer.minimap.create({
      interact: true
    }),
    WaveSurfer.markers.create({
      markers: [
        {
            time: 5.5,
            label: "V1",
            color: '#ff990a'
        },
        {
            time: 10,
            label: "V2",
            color: '#00ffcc',
            position: 'top'
        }
    ]
    })
  ]
});

const regions = [
  {
    id: 'r1',
    start: 0,
    end: 5,
    loop: false,
    drag: true,
    resize: true,
    color: "rgba(255, 110, 0, 0.1)"
  },
  {
    id: 'r2',
    start: 7,
    end: 14,
    loop: false,
    drag: true,
    resize: true,
    color: "rgba(110, 255, 0, 0.1)"
  },
  {
    id: 'r3',
    start: 20,
    end: 30,
    loop: true,
    drag: true,
    resize: true,
    color: "rgba(255, 110, 255, 0.1)"
  }
]

const handleAddRegions = () => {
  regions.forEach(region => {
    wavesurfer.addRegion(region);
  });
}

handleAddRegions();

const getSongByIndex = (index) => { 
  return audioDatabase[index].source;
};

const resetIndex = () => {
  if (songIndex < 0) {
    songIndex = audioDatabase.length - 1;
  }
  if (songIndex > audioDatabase.length - 1) {
    songIndex = 0;
  }
  return songIndex;
};

const updateWave = () => {
  wavesurfer.load(audioDatabase[songIndex].source);
};

pausePlayBtn.addEventListener("click", (e) => {
  wavesurfer.playPause();
  if (wavesurfer.isPlaying()) {
    pausePlayBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
  } else {
    pausePlayBtn.innerHTML = `<i class="fa fa-play" aria-hidden="true"></i>`;
  }
  
});

stopBtn.addEventListener("click", (e) => {
  wavesurfer.stop();
});

volumeRange.addEventListener("change", (e) => {
  wavesurfer.setMute(false);
  wavesurfer.setVolume(e.target.value);
  volumeBtn.innerHTML = `<i class="fa fa-volume-up" aria-hidden="true"></i>`;
});

volumeBtn.addEventListener("click", (e) => {
  wavesurfer.setMute(true);
  volumeRange.value = 0;
  volumeBtn.innerHTML = `<i class="fa fa-volume-off" aria-hidden="true"></i>`;
});

zoomRange.addEventListener('change', (e) => {
  wavesurfer.zoom(e.target.value);
});

stepForwardBtn.addEventListener("click", (e) => {
  wavesurfer.skipForward();
});

stepBackwardBtn.addEventListener("click", (e) => {
  wavesurfer.skipBackward();
});

forwardBtn.addEventListener("click", (e) => {
  songIndex++;
  resetIndex();
  wavesurfer.loadBlob(new Blob([getSongByIndex(songIndex)]));
  wavesurfer.play();
  updateWave();
});

backwardBtn.addEventListener("click", (e) => {
  songIndex--;
  resetIndex();
  wavesurfer.loadBlob(new Blob([getSongByIndex(songIndex)]));
  wavesurfer.play();
  updateWave();
});

autoCenterBtn.addEventListener("click", (e) => {
  wavesurfer.params.autoCenter = !wavesurfer.params.autoCenter;
  if (wavesurfer.params.autoCenter) {
    autoCenterBtn.innerHTML = `<i class="fa fa-eye" aria-hidden="true"></i>`;
  } else {
    autoCenterBtn.innerHTML = `<i class="fa fa-eye-slash" aria-hidden="true"></i>`;
  }
});

audioRate.addEventListener('change', (e) => {
  wavesurfer.setPlaybackRate(e.target.value);
});

wavesurfer.on('ready', function () {
  volumeRange.value = wavesurfer.getVolume();
  wavesurfer.stop();
});

wavesurfer.on('finish ', function () {
  wavesurfer.seekTo(0);
});

wavesurfer.on('region-update-end', e => {
  console.log(wavesurfer.regions.list);
});

wavesurfer.on('region-dblclick', e => {
  const res = confirm('Delete region');
  if (res) {
    e.remove();
  }
});

wavesurfer.regions.list.r1.on('update', e => {
  console.log('update');
});

updateWave();
