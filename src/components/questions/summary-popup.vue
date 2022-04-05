<template>
  <f7-popup
    :opened="openPopup"
    :closeOnEscape="false"
    :closeByBackdropClick="false"
    @popup:open="popupOpen"
  >
    <f7-page >
      <f7-navbar>
        <f7-nav-left >
          <f7-link icon="icon-back" @click="closePopup"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
        <f7-nav-right>
          <f7-link icon="icon-header-close" @click="closeCheckList"></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-toolbar bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button color="custom" fill class="col text-uppercase" @click="submitHandler">{{$ml.get('COM_MSG008')}}</f7-button>
        </div>
      </f7-toolbar>

      <f7-list>
        <f7-list-item
          :title="$ml.get('HOME_MSG006')"
          :after="assetName"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-asset text-color-lightgray"></f7-icon>
        </f7-list-item>
        <f7-list-item
          :title="$ml.get('FAULTS_MSG005')"
          :after="pageTitle"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-checklist text-color-lightgray"></f7-icon>
        </f7-list-item>
        <f7-list-item
          :title="$ml.get('QUESTIONS_MSG014')"
          :after="info.User.FirstName + ' ' + info.User.SubName"
        >
          <f7-icon slot="media" icon="f7-icons icon-profile-name text-color-lightgray"></f7-icon>
        </f7-list-item>
      </f7-list>

      <f7-block-title class="text-uppercase text-align-center">{{$ml.get('QUESTIONS_MSG007')}}</f7-block-title>
      <f7-block class="row">
        <div class="col-50 rounded-small text-color-white bg-color-red text-align-center padding-vertical">
          <div><i class="f7-icons icon-other-fail size-36 padding-bottom-8"></i></div>
          <div>{{$ml.get('QUESTIONS_MSG008')}}</div>
          <div>{{ summary['fail'] }}</div>
        </div>
        <!-- <div class="col-33 rounded-small text-color-white bg-color-orange text-align-center padding-vertical">
          <div><i class="f7-icons icon-other-na-items size-36 padding-bottom-8"></i></div>
          <div>{{$ml.get('QUESTIONS_MSG009')}}</div>
          <div>{{ summary['na'] }}</div>
        </div> -->
        <div class="col-50 rounded-small text-color-white bg-color-custom text-align-center padding-vertical">
          <div><i class="f7-icons icon-other-passed-items size-36 padding-bottom-8"></i></div>
          <div>{{$ml.get('QUESTIONS_MSG010')}}</div>
          <div>{{ summary['pass'] }}</div>
        </div>
      </f7-block>

      <f7-block>
        <p>{{$ml.get('QUESTIONS_MSG005')}}</p>
        <p class="text-color-white">{{$ml.get('QUESTIONS_MSG006')}}</p>
      </f7-block>

    </f7-page>
  </f7-popup>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'


  export default {
    name: "summary-popup",
    props: {
      openPopup: {
        type: Boolean,
        default: false
      },
      assetName: {
        type: String,
        default: ''
      },
      imei: {
        type: String,
        default: ''
      },
      checklist: {
        type: Object,
        default: () => {}
      },
      answers: {
        type: Object,
        default: () => {}
      }
    },
    data: () => ({
      pageTitle: 'Summary',
      summary: {},
    }),
    computed: {
      ...mapGetters(['info'])
    },
    methods: {
      ...mapActions(['UPLOAD_TASK']),
      closePopup(){
        this.$emit('closePopup')
      },
      closeCheckList(){
        this.$emit('closeCheckList')
      },
      popupOpen(){
        var summary = {
          pass: 0,  //pass
          na: 0,  //na
          fail: 0,  //fault
        };

        // counting answers states
        for (const key of Object.keys(this.answers)) {
          summary[this.answers[key].state]++;
        }
        this.pageTitle = this.checklist.Name;
        this.summary = summary;
      },
      async submitHandler() {

        let data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,

          CheckCode: this.checklist.Code,
          IMEI: this.imei,
          Options: []
        };

        for (const key of Object.keys(this.answers)) {
          data.Options.push({
            OptionCode: key,
            Result: this.answers[key].state,
            Photos: this.answers[key].img || '',
            //ReasonCode: this.answers[key].reasonCode || '',
            message: this.answers[key].notes || ''
          })
        }

        //this.$emit('summaryResult', data)


        try {
          this.$f7.progressbar.show();
          let result = await this.$store.dispatch('UPLOAD_TASK', data);
          this.$f7.progressbar.hide();
          if(!result){
            return
          }
          this.$emit('selectTripType',{TaskCode: result.Data.Code, UpdateTime: result.Data.UpdateTime})
        } catch (e) {this.$f7.progressbar.hide();}
      },

    }
  }
</script>

<style scoped>

</style>