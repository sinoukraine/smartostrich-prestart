<template>
  <f7-page name="questions">

    <f7-navbar large>
      <f7-nav-left >
        <f7-link icon="icon-back" @click="closeCheckList"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
      <f7-nav-title-large>{{pageTitle}}</f7-nav-title-large>
      <f7-nav-right>
        <f7-link icon="icon-header-close" @click="closeCheckList"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-toolbar bottom no-shadow class="custom-toolbar">
      <div class="row width-100 padding-horizontal">
        <f7-button color="custom" fill class="col text-uppercase" :class="{disabled: !isAllAnswered}" @click="closeCheckList(true)">{{$ml.get('COM_MSG038')}}</f7-button>
      </div>
    </f7-toolbar>

    <!-- :selectedReason="faultSelectedReason"-->
    <fault-popup
      :key="faultPopupKey"
      :openPopup="isFaultPopupOpen"
      :questionDetails="faultOption"

      :savedNotes="savedNotes"
      :savedImg="savedImg"
      @closePopup="isFaultPopupOpen = false"
      @setFault="setFault"
    />

 
    <div class="list media-list no-hairlines">
      <ul>
        <li
          v-for="question of checklist.Options"
          :key="question.Code"
        >
          <div class="item-content" >
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title"></div>
                <div class="item-after">
                 <!-- {{#if images}}
                  <a  href="#" class="link color-blue showImages" data-images = "{{images}}"> {{@global.LANGUAGE.COM_MSG08}}</a>
                  {{else}}
                  {{@global.LANGUAGE.COM_MSG07}}
                  {{/if}}-->
                  <!--{{$ml.get('QUESTIONS_MSG004')}}-->
                </div>
              </div>
              <div class="item-text no-max-lines" >
               {{ question.Name }}
              </div>
              <div class="item-text margin-top">
                <div class="row">
                  <button
                    class="col button button-fill color-red question-button"
                    :data-state="'fail'"
                    :class="{active: question.selectedState === 'fail'}"
                    @click="openFaultPopup(question.Code)"
                  >{{$ml.get('QUESTIONS_MSG001')}}</button>

                 

                  <button
                    class="col button button-fill color-custom  question-button "
                    :data-state="'pass'"
                    :class="{active: question.selectedState === 'pass'}"
                    @click="setQuestionState('pass', question.Code)"
                  >{{$ml.get('QUESTIONS_MSG003')}}</button>
                </div>
              </div>
            </div>
          </div>
        </li>

      </ul>
    </div>

  </f7-page>
</template>

<script>
  //import Vue from 'vue'
  //import $$ from 'dom7';
  import {mapGetters, mapActions} from 'vuex'
  import FaultPopup from '../components/questions/fault-popup'
  
   import checkLists from '../js/helpers/check-list'
  import moment from 'moment'
  import tFormat from '../js/helpers/time-formats'


  export default {
    name: "questions",
    data: ()=>({
      pageTitle: 'Questions',
      checklist: {},
      imei: '',
      assedId: '',
      assetName: '',
      answers: {},
      isAllAnswered: false,

      faultPopupKey: 1,
      isFaultPopupOpen: false,
      faultOption: {},
      //faultSelectedReason: '',
      savedNotes: '',
      savedImg: '',

      
    }),
    components: {
      
      FaultPopup
    },
    computed: {
      ...mapGetters(['info']),

    },
    methods: {
      closeCheckList(isDone) {

        if(isDone) {
           
                this.$f7router.back()
        } else {
             this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get('PROMPT_MSG004'),
          buttons:[
            {
              text: this.$ml.get('COM_MSG003'),
            },
            {
              text: this.$ml.get('COM_MSG002'),
              onClick: ()=>{
                
                this.$f7router.back()
              }
            }
          ]
        })
        }
       
      },
      async setQuestionState(state = '', code = '', additionalDetails = {}){
        this.answers[code] = {
          ...additionalDetails,
          state,
        };

        this.checklist.Options.find( option => option.Code === code).selectedState = state;
        //await Vue.nextTick();
        await this.$nextTick();

        let answeredKeys = Object.keys(this.answers);
        if (answeredKeys.length === this.checklist.Options.length){
          this.isAllAnswered = true;
        }
      },
      async openFaultPopup(code){
        this.faultOption = this.checklist.Options.find( option => option.Code === code);
        //this.faultSelectedReason='';
        this.savedNotes = '';
        this.savedImg = '';

        if(this.answers[code] && this.answers[code].state === 'fail'){
          //this.faultSelectedReason = this.answers[code].reasonCode;
          this.savedNotes = this.answers[code].notes;
          this.savedImg = this.answers[code].img;

        }else{
          /*if(this.faultOption.Reasons && this.faultOption.Reasons.length){
            this.faultSelectedReason = this.faultOption.Reasons[0].Code;
          }*/
        }

        //fix to rerender popup and reinit smart select
        this.faultPopupKey+=1;
        //await Vue.nextTick();
        await this.$nextTick();
        this.isFaultPopupOpen = true;
      },
      setFault(faultDetails){
        this.setQuestionState('fail', faultDetails.optionCode, faultDetails);
        this.isFaultPopupOpen = false;
      },

      selectTripType(params) {
        var modalTex = `
                    <div class="custom-modal-text margin-bottom">${ this.$ml.get('PROMPT_MSG010') }</div>
                    <div class="list no-margin no-hairlines text-color-black">
                        <ul>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="1"  checked/>
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${ this.$ml.get('COM_MSG014') }</div>
                                    </div>
                                </label>
                            </li>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="2"  />
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${ this.$ml.get('COM_MSG015') }</div>
                                    </div>
                                </label>
                            </li>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="3"  />
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${ this.$ml.get('COM_MSG016') }</div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                `;
        this.$f7.methods.customDialog({
          text: modalTex,
          buttons:[
            {
              text: this.$ml.get('COM_MSG017'),
              onClick: async (dialog) => {
                let tripType = dialog.$el.find('input[name="trip-type"]:checked').val();

                if (tripType !== '3') { //diagnostic
                  let data = {
                    MinorToken: this.info.MinorToken,
                    MajorToken: this.info.MajorToken,

                    TaskCode: params.TaskCode,
                    TripType: tripType
                  };
                  try {
                    this.$f7.progressbar.show();
                    let result = await this.$store.dispatch('START_TRIP', data);
                    this.$f7.progressbar.hide();
                    if (!result) {
                      return
                    }
                  } catch (e) {this.$f7.progressbar.hide();}

                  let obj = {
                    isTripStarted: true,
                    Trip: {
                      AssetName: this.assetName,
                      AssetId: this.assetId,
                      IMEI: this.imei,
                      StartTime: moment(params.UpdateTime).format(tFormat[0]),
                      TaskCode: params.TaskCode,
                      TripType: tripType,
                    }
                  };

                  this.$f7.methods.setInStorage({
                    name: 'additionalFlags',
                    data: obj
                  });

                  this.$store.dispatch('updateCurrentTrip', obj)

                  this.$f7.methods.customDialog({
                    text: this.$ml.get('PROMPT_MSG033'),
                  })

                  this.$store.dispatch('SET_NOTIFICATION_STATUS', {
                    IMEI: this.imei,
                    MinorToken: this.info.MinorToken,
                    State: 1,
                    MobileToken: !localStorage.PUSH_MOBILE_TOKEN ? '123' : localStorage.PUSH_MOBILE_TOKEN,
                    AppKey: !localStorage.PUSH_APP_KEY ? '123' : localStorage.PUSH_APP_KEY,
                    Token: !localStorage.PUSH_DEVICE_TOKEN ? '123' : localStorage.PUSH_DEVICE_TOKEN,
                    Type: !localStorage.DEVICE_TYPE ? 'webapp' : localStorage.DEVICE_TYPE,
                  })
                  /*if (window.BackgroundGeolocation) {
                    window.BackgroundGeolocation.setConfig({
                      params: {
                        //Token: userInfo.token,
                      }
                    }).then(state => {
                      window.BackgroundGeolocation.start().then(state => {
                        this.$f7.methods.showToast(this.$ml.get('COM_MSG020'));
                      })
                    }).catch(error => {
                      console.log('- BackgroundGeolocation error: ', error);
                    });
                  }*/

                }
                this.$f7.view.main.router.back();
               
              }
            }
          ]
        })
      },
    },
    mounted() {

     
      let checklist = checkLists.find(checklist => checklist.Code === this.$f7route.query.cheklist );
      checklist.Options = this.$f7.methods.sortArrayByObjProps(checklist.Options, {
        prop:'Order',
        direction: 1
      },{
        prop:'Name',
        direction: 1
      });

      //use Vue.set to make our states(fail, na, pass) be reactive when user change them
      checklist.Options.forEach((el) => {
        //Vue.set(el, 'selectedState', '')
        this.$set(el, 'selectedState', '')
      });

      this.pageTitle = checklist.Name;
      this.checklist = checklist;
      this.imei = this.$f7route.query.imei;

      let asset = this.info.Devices.find(device => device.IMEI === this.imei);

      this.assetId = asset.ID;
      this.assetName = asset.Name;
    }
  }
</script>

<style scoped>
  .question-button {
    opacity: .5;
  }
  .question-button.active{
    opacity: 1;
  }
</style>