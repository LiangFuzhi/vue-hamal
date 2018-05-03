import plusReady from '../../libs/plusReady.js'
import os from '../../libs/os.js'

// let audioObj = false
/**
 * [audio 文字转语音]
 * @param  {String} text [需要转为语音的文字]
 * @return {[type]}                   [description]
 */
export default {

  init: function (cb) {
    if (this.audio === undefined) {
      this.audio = {
        playCompleted: true,
        playList: []
      }

      let self = this

      plusReady(() => {
        if (os.android) {
          let main = window.plus.android.runtimeMainActivity()
          let SpeechUtility = window.plus.android.importClass('com.iflytek.cloud.SpeechUtility')
          SpeechUtility.createUtility(main, 'appid=' + window.plus.runtime.appid)
          let SynthesizerPlayer = window.plus.android.importClass('com.iflytek.cloud.SpeechSynthesizer')
          let play = SynthesizerPlayer.createSynthesizer(main, null)
          // 事件
          let synthesizerListener = window.plus.android.implements('com.iflytek.cloud.SynthesizerListener', {
            onEvent: function (arg0, arg1, arg2, arg3) {
              console.log('onEvent')
            },
            onSpeakBegin: function () {
              console.log('开始阅读')
            },
            onSpeakPaused: function () {
              console.log(' 暂停播放 ')
            },
            onSpeakResumed: function () {
              console.log('继续播放')
            },
            onBufferProgress: function (percent, beginPos, endPos, info) {
              console.log('合成进度' + percent)
            },
            onSpeakProgress: function (percent, beginPos, endPos) {
              // 合成进度
              console.log('播放进度' + percent)
            },
            onCompleted: function (e) {
              // alert("aa");
              console.log('播放完毕')

              if (self.audio.playList.length > 0) {
                self.audio.playCompleted = false
                let text = self.audio.playList[0]
                self.audio.playList.splice(0, 1)

                play.startSpeaking(text, self.audio.playListener)
              } else {
                self.audio.playCompleted = true
              }
            }
          })

          this.audio.play = play
          this.audio.playListener = synthesizerListener
        } else if (os.ios) {
          let AVSpeechSynthesizer = window.plus.ios.importClass('AVSpeechSynthesizer')
          let play = new AVSpeechSynthesizer()

          this.audio.play = play

          // let voice = AVSpeechSynthesisVoice.voiceWithLanguage("zh-CN");
          // let utterance =  AVSpeechUtterance.speechUtteranceWithString(text);
          // utterance.plusSetAttribute("rate",0.4);
          // utterance.setVoice(voice);
          // sppech.speakUtterance(utterance);
          // 停止
          // sppech.stopSpeakingAtBoundary(0)
          // 暂停
          // sppech.pauseSpeakingAtBoundary(0);
          // 继续
          // sppech.continueSpeaking(0);
          // window.plus.ios.deleteObject(voice);
          // window.plus.ios.deleteObject(utterance);
          // window.plus.ios.deleteObject(sppech);
        }
        cb()
      })
    } else {
      cb()
    }
  },

  play: function (text = '收到一笔新的货款') {
    // if(!audioObj){
    //   audioObj = document.createElement('AUDIO')
    // }
    // audioObj.src=`http://tsn.baidu.com/text2audio?tok=123&tex=${text}&cuid=1231156&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=0&vol=5&pit=5`
    // audioObj.play();

    this.init(() => {
      let play = this.audio.play
      if (os.android) {
        if (this.audio.playCompleted) {
          this.audio.playCompleted = false
          play.startSpeaking(text, this.audio.playListener)
        } else {
          this.audio.playList.push(text)
        }
      } else if (os.ios) {
        let AVSpeechUtterance = window.plus.ios.importClass('AVSpeechUtterance')
        let AVSpeechSynthesisVoice = window.plus.ios.import('AVSpeechSynthesisVoice')
        let voice = AVSpeechSynthesisVoice.voiceWithLanguage('zh-CN')
        let utterance = AVSpeechUtterance.speechUtteranceWithString(text)
        utterance.plusSetAttribute('rate', 0.4)
        utterance.setVoice(voice)
        // play.stopSpeakingAtBoundary(0);//停止播放
        play.speakUtterance(utterance)
        // 停止
        // play.stopSpeakingAtBoundary(0)
        // 暂停
        // play.pauseSpeakingAtBoundary(0);
        // 继续
        // play.continueSpeaking(0);
        // window.plus.ios.deleteObject(voice);
        // window.plus.ios.deleteObject(utterance);
        // window.plus.ios.deleteObject(play);
      }
    })
  },

  stop: function () {

  }
}
