<template>
  <f7-page name="home">
    <template v-if="isLoggedIn">
      <!-- Top Navbar -->
      <f7-navbar large>
        <f7-nav-left>
          <!--<f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left" @click="createNotification"></f7-link>-->
          <f7-link
            icon-ios="f7:menu"
            icon-aurora="f7:menu"
            icon-md="material:menu"
            panel-open="left"
          ></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{ $ml.get("SIDEBAR_MSG001") }}</f7-nav-title>
        <f7-nav-title-large>{{ $ml.get("SIDEBAR_MSG001") }}</f7-nav-title-large>

        <f7-nav-right>
          <f7-link
            icon="f7-icons size-25 icon-header-alarm"
            href="/notifications/"
          ></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <template v-if="currentTrip && currentTrip.isTripStarted">
        <!--<f7-toolbar bottom no-shadow class="custom-toolbar custom-toolbar-x2">
          <div class="row width-100 padding-horizontal">
            <f7-button
                v-if="isImmobilised"
                color="red"
                fill
                class="col-100 text-uppercase margin-bottom margin-top"
                @click="sendUnimmobilise"
                :class="{'disabled': !isImmobilisationSupported}"
            >{{$ml.get('HOME_MSG011')}}</f7-button>
            <f7-button
                v-else
                color="red"
                fill
                class="col-100 text-uppercase margin-bottom margin-top"
                @click="sendImmobilise"
                :class="{'disabled': !isImmobilisationSupported}"
            >{{$ml.get('HOME_MSG010')}}</f7-button>
            <f7-button color="green" fill class="col-100 text-uppercase margin-bottom" @click="endTrip">{{$ml.get('COM_MSG005')}}</f7-button>
          </div>
        </f7-toolbar>-->
        <f7-toolbar bottom no-shadow class="custom-toolbar">
          <div class="row width-100 padding-horizontal">
            <f7-button
              color="red"
              fill
              class="col-100 text-uppercase"
              @click="endTrip"
              >{{ $ml.get("COM_MSG005") }}</f7-button
            >
          </div>
        </f7-toolbar>

        <f7-block-header>{{ $ml.get("HOME_MSG008") }}</f7-block-header>
        <f7-list>
          <f7-list-item
            :title="$ml.get('HOME_MSG006')"
            :after="currentTrip.Trip.AssetName"
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-other-asset text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-item
            :title="$ml.get('HOME_MSG009')"
            :after="$ml.get('TextTripType')"
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-report-trip text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-item
            :title="$ml.get('HOME_MSG007')"
            :after="currentTrip.Trip.StartTime"
          >
            <f7-icon
              slot="media"
              icon="f7-icons  size-25 icon-other-date text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-item
            :title="$ml.get('HOME_MSG012')"
            :after="currentTripDuration"
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-trip-time text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
        </f7-list>
        <f7-block>
          <f7-link
            :href="`/accident-report/?imei=${selectedAsset}`"
            icon="f7-icons size-25 icon-notification size-18 margin-right-half"
            :text="$ml.get('HOME_MSG013')"
            color="orange"
            class="button button-fill vertical-align-middle"
          ></f7-link>
        </f7-block>
      </template>

      <template v-else>
        <!-- Toolbar-->
        <f7-toolbar bottom no-shadow class="custom-toolbar">
          <div class="row width-100 padding-horizontal">
            <f7-button
              color="custom"
              fill
              class="col text-uppercase"
              @click="showCheckList"
              >{{ $ml.get("HOME_MSG005") }}</f7-button
            >
          </div>
        </f7-toolbar>

        <f7-list>
          <f7-list-item
            class="item-input asset-select custom-smart-select-wrapper"
            :title="$ml.get('HOME_MSG001')"
            smart-select
            :smart-select-params="{
              openIn: 'popup',
              searchbar: true,
              closeOnSelect: true,
            }"
            :key="componentKeyVehicle"
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-other-asset text-color-lightgray"
            ></f7-icon>
            <div
              slot="content-end"
              @click.stop="isMapSelectAssetOpened = true"
              class="link margin-right"
            >
              <i class="f7-icons size-25 icon-address text-color-blue"></i>
            </div>
            <!-- @click="scanBarCode"  -->
            <div slot="content-end" class="link margin-right">
              <i class="f7-icons size-25 icon-scan text-color-blue"></i>
            </div>
            <select name="assetList" v-model="selectedAsset" required validate>
              <option
                v-for="asset in assetList"
                :key="asset.IMEI"
                :value="asset.IMEI"
                :disabled="!!asset.ContactCode"
              >
                {{ asset.Name }}
              </option>
            </select>
          </f7-list-item>

          <f7-list-item
             
            class="item-input custom-smart-select-wrapper cheklist-smart-select"
            :title="$ml.get('HOME_MSG002')"
            smart-select
            :key="componentKeyChecklist"
            ref="checklistSmartSelect"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-other-checklist text-color-lightgray"
            ></f7-icon>
            <select
              name="checkLists"
              v-model="selectedCheckList"
              required
              validate
              @change="showCheckList"
            >
              <option
                v-for="list in checkLists"
                :key="list.Code"
                :value="list.Code"
              >
                {{ list.Name }}
              </option>
            </select>
          </f7-list-item>

          <f7-list-item>
             <a href="/check-list/" class="item-link item-content">
                  <div class="item-inner">Go to Check List</div>
                </a>
          </f7-list-item>

          <f7-list-item
            :footer="$ml.get('HOME_MSG004')"
            :title="$ml.get('HOME_MSG003')"
          >
            <f7-toggle :checked="isDriver"></f7-toggle>
          </f7-list-item>
        </f7-list>
      </template>

      <map-select-asset
        :isOpened="isMapSelectAssetOpened"
        :selectedImei="selectedAsset"
        @closePopup="isMapSelectAssetOpened = false"
        @selectAsset="onMapSelectAsset"
      />
    </template>
    <template v-else>
      <login-screen />
    </template>
  </f7-page>
</template>

<script>
import LoginScreen from "../components/login-screen";
import MapSelectAsset from "../components/map-select-asset";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import getDifferenceBTtwoDates from "../js/helpers/get-difference-bt-two-dates";
import tFormat from "../js/helpers/time-formats";

import checkList from "../js/helpers/check-list";

import enumTripTypes from "../js/helpers/enum-trip-types";
import enumAssetPermissions from "../js/helpers/enum-asset-permissions";

export default {
  data() {
    //console.log(localStorage.IMMOBILISATION_STATE && localStorage.IMMOBILISATION_STATE === 'on')
    return {
      componentKeyVehicle: Date.now(),
      componentKeyChecklist: Date.now() + 1,
      isTripStarted: false,
      currentTripDuration: "",
      currentTripDurationTimer: null,
      assetList: [],
      checkLists: [],
      selectedAsset: null,
      selectedCheckList: null,
      isDriver: true,
      isMapSelectAssetOpened: false,
      isImmobilised:
        localStorage.IMMOBILISATION_STATE &&
        localStorage.IMMOBILISATION_STATE === "on",
      isImmobilisationSupported: false,
    

      //tripTypeText: enumTripTypes
      //user: this.$f7route.context.user,
    };
  },
  components: {
    LoginScreen,
    MapSelectAsset,
  },
  computed: {
    ...mapGetters(["isLoggedIn", "info", "currentTrip"]),
    mlTextTripType() {
      return enumTripTypes[this.currentTrip.Trip.TripType] || "";
    },
  },
  watch: {
    selectedAsset() {
      //fix to rerender smart select and to see selected values
      this.componentKeyVehicle = Date.now();
    },
    selectedCheckList() {
      //fix to rerender smart select and to see selected values
      this.componentKeyChecklist = Date.now() + 1;
    },
    info() {
      this.assetList = this.info.Devices || [];
      // this.checkLists = this.info.CheckList || [];

      if (this.assetList.length) {
        let asset = this.assetList.find((itm) => !itm.ContactCode);
        if (asset) {
          this.selectedAsset = asset.IMEI;
        }
      }
      // if(this.checkLists.length){
      //   this.selectedCheckList = this.checkLists[0].Code
      // }
    },
    async isLoggedIn(val) {
      if (val) {
        let additionalFlags =
          this.$f7.methods.getFromStorage("additionalFlags");
        if (
          !this.$f7.methods.isObjEmpty(additionalFlags) &&
          additionalFlags.isTripStarted &&
          !this.$f7.methods.isObjEmpty(additionalFlags.Trip)
        ) {
          let obj = {
            isTripStarted: additionalFlags.isTripStarted,
            Trip: additionalFlags.Trip,
          };
          this.$store.dispatch("updateCurrentTrip", obj);
        }

        let data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
        };
        this.$f7.progressbar.show();
        let result = await this.$store.dispatch("GET_TRIPS_IN_PROGRESS", data);
        this.$f7.progressbar.hide();

        if (!result) {
          return;
        }
      }
   
    },
    currentTrip(val) {
      console.log("currentTrip", val);

      if (val && val.isTripStarted) {
        this.componentKeyVehicle = Date.now();
        this.componentKeyChecklist = Date.now() + 1;
        let asset = this.assetList.find((itm) => itm.ID === val.Trip.AssetId);
        this.isImmobilisationSupported =
          (asset.Permissions & enumAssetPermissions.immobilisation) > 0;
        this.getCurrentTripDuration();
        this.currentTripDurationTimer = setInterval(
          this.getCurrentTripDuration,
          60 * 1000
        );
      } else {
        clearInterval(this.currentTripDurationTimer);
        this.currentTripDuration = "";
      }
    },
  },
  methods: {
    /*createNotification(){
        console.log('click')
    //var json = '{"title":"GEOLOCK WARNING","type":1024,"imei":"0000004700673137","name":"A16 WATCH","lat":43.895091666666666,"lng":125.29207,"speed":0,"direct":0,"time":"2018-08-23 16:56:36"}';
    //showMsgNotification([json]);
    //getNewData();
    //console.log($$('.status_page').length);

        let json = '{"title":"Speed","type":32,"imei":"0000001683122697","name":"0000001683122697","lat":50.249984,"lng":32.282368,"speed":130,"direct":0,"time":"2018-08-23 16:56:37"}';

        this.$f7.methods.setNotificationList([json])
      },*/

    showCheckList() {
      if (!this.selectedCheckList) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG005"),
        });
        return;
      }

      if (!this.selectedAsset) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG006"),
        });
        return;
      }

      /*this.$f7.methods.showToast(this.$ml.get('COM_MSG020'));*/

      this.$f7router.navigate({
        name: "questions",
        query: {
          imei: this.selectedAsset,
          cheklist: this.selectedCheckList,
          isDriver: this.isDriver,
        },
      });
    },
    async endTrip() {
      let data = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,

        TaskCode: this.currentTrip.Trip.TaskCode,
      };

      this.$f7.progressbar.show();
      let result = await this.$store.dispatch("END_TRIP", data);
      this.$f7.progressbar.hide();
      if (!result) {
        return;
      }

      this.$store.dispatch("SET_NOTIFICATION_STATUS", {
        IMEI: this.selectedAsset,
        MinorToken: this.info.MinorToken,
        State: 0,
        MobileToken: !localStorage.PUSH_MOBILE_TOKEN
          ? "123"
          : localStorage.PUSH_MOBILE_TOKEN,
        AppKey: !localStorage.PUSH_APP_KEY ? "123" : localStorage.PUSH_APP_KEY,
        Token: !localStorage.PUSH_DEVICE_TOKEN
          ? "123"
          : localStorage.PUSH_DEVICE_TOKEN,
        Type: !localStorage.DEVICE_TYPE ? "webapp" : localStorage.DEVICE_TYPE,
      });

      let tripObj = {
        isTripStarted: false,
        Trip: {},
      };
      this.$f7.methods.setInStorage({
        name: "additionalFlags",
        data: tripObj,
      });
      this.$store.dispatch("updateCurrentTrip", tripObj);

      this.$f7router.navigate("/trip/?id=3&getList=true", {
        context: result.Data,
      });

      /*if (window.BackgroundGeolocation) {
          window.BackgroundGeolocation.stop().then(state => {
            this.$f7.methods.showToast(this.$ml.get('COM_MSG021'));
          })
        }*/
    },
    onMapSelectAsset(imei) {
      this.selectedAsset = imei;
      //console.log(imei)
    },
    async sendImmobilise() {
      let data = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,
        code: this.currentTrip.Trip.AssetId,
        state: "on",
      };
      this.$f7.progressbar.show();
      let result = await this.$store.dispatch("SET_IMMOBILISATION", data);
      this.$f7.progressbar.hide();
      if (!result) {
        return;
      }
      localStorage.IMMOBILISATION_STATE = data.state;
      this.isImmobilised = true;
    },
    async sendUnimmobilise() {
      let data = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,
        code: this.currentTrip.Trip.AssetId,
        state: "off",
      };
      this.$f7.progressbar.show();
      let result = await this.$store.dispatch("SET_IMMOBILISATION", data);
      this.$f7.progressbar.hide();
      if (!result) {
        return;
      }
      localStorage.IMMOBILISATION_STATE = data.state;
      this.isImmobilised = false;
    },
    getCurrentTripDuration() {
      let dateDifference = getDifferenceBTtwoDates(
        moment(this.currentTrip.Trip.StartTime, tFormat[0]),
        moment()
      );
      this.currentTripDuration = moment
        .duration(dateDifference, "milliseconds")
        .format("d[d] h[h] m[m]");
    },
  },
  created() {},
  mounted() {
    this.assetList = this.info.Devices || [];
    this.checkLists = checkList;

    if (this.assetList.length) {
      let asset = this.assetList.find((itm) => !itm.ContactCode);
      if (asset) {
        this.selectedAsset = asset.IMEI;
      }
    }

    if (this.checkLists.length) {
      this.selectedCheckList = this.checkLists[0].Code;
    }

    if (this.currentTrip && this.currentTrip.isTripStarted) {
      this.getCurrentTripDuration();
    }

    setTimeout(() => {
      var checklistSmartSelect = this.$refs.checklistSmartSelect.f7SmartSelect;

      var mySmartSelect = this.$f7.smartSelect.create({
        el: ".cheklist-smart-select a",
    
      });

   
      
    }, 1000);
  },
};
</script>