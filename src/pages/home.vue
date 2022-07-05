<template>
  <f7-page name="home">
    <template v-if="isLoggedIn">
      <!-- Top Navbar -->
      <f7-navbar f7-navbar large>
        <f7-nav-left>
          <!--<f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left" @click="createNotification"></f7-link>-->

          <f7-link
            v-if="newDelivery"
            @click="newDelivery = false"
            icon="f7-icons size-20 icon-arrow-back"
          ></f7-link>

          <f7-link
            v-else-if="
              currentTrip && currentTrip.isTripStarted && !editTripTemplate
            "
            icon="f7-icons size-20 icon-arrow-back"
            @click="editTripTemplate = true"
          ></f7-link>
          <f7-link
            v-else
            icon-ios="f7:menu"
            icon-aurora="f7:menu"
            icon-md="material:menu"
            panel-open="left"
          ></f7-link>
        </f7-nav-left>

        <f7-nav-title sliding>{{ $ml.get("SIDEBAR_MSG001") }}</f7-nav-title>
        <f7-nav-title-large v-if="newDelivery">{{
          $ml.get("COM_MSG039")
        }}</f7-nav-title-large>
        <f7-nav-title-large v-else>{{
          $ml.get("SIDEBAR_MSG001")
        }}</f7-nav-title-large>

        <f7-nav-right>
          <f7-link
            icon="f7-icons size-20 icon-header-alarm"
            href="/notifications/"
          ></f7-link>

          <f7-link
            icon="f7-icons size-20 icon-header-close"
            @click="cancelTrip()"
          ></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <template v-if="editTripTemplate">
        <f7-toolbar bottom no-shadow class="custom-toolbar">
          <div class="row width-100 padding-horizontal">
            <!-- <f7-button
              color="custom"
              fill
              class="col-50 text-uppercase"
              @click="editTrip"
              >{{ $ml.get("HOME_MSG023") }}</f7-button
            > -->
            <f7-button
              color="black"
              fill
              class="col-50 text-uppercase"
              @click="
                editTripTemplate = false;
                newDelivery = false;
              "
              >{{ $ml.get("HOME_MSG024") }}</f7-button
            >
          </div>
        </f7-toolbar>

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
            :title="$ml.get('FAULTS_MSG005')"
            after="Farmwize CheckSheet "
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-other-checklist text-color-lightgray"
            ></f7-icon>
          </f7-list-item>

          <f7-list-item
            :after="firstName + lastName"
            :title="$ml.get('HOME_MSG003')"
          >
            <f7-icons
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icons>
          </f7-list-item>

          <f7-list-item
            :title="$ml.get('HOME_MSG009')"
            @click="selectTripType"
            :after="selectedTrip"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-menu-trips text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG014')"
            type="text"
            :placeholder="$ml.get('HOME_MSG014')"
            clear-button
            :value="customerName"
            @input="customerName = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icon>
          </f7-list-input>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG015')"
            type="text"
            :placeholder="$ml.get('HOME_MSG015')"
            :value="customerAddress"
            readonly
            clear-button
            @input="customerAddress = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-address text-color-lightgray"
            ></f7-icon>

            <div
              slot="content-end"
              @click.stop="isMapDeliveryAddressOpened = true"
              class="link margin-right"
            >
              <i class="f7-icons size-25 icon-address text-color-blue"></i>
            </div>
          </f7-list-input>
        </f7-list>
      </template>
      <template v-else-if="newDelivery">
        <f7-toolbar bottom no-shadow class="custom-toolbar">
          <div class="row width-100 padding-horizontal">
            <f7-button
              color="custom"
              fill
              class="col text-uppercase"
              @click="endTrip(false)"
              >{{ $ml.get("HOME_MSG005") }}</f7-button
            >
          </div>
        </f7-toolbar>

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
            :title="$ml.get('FAULTS_MSG005')"
            after="Farmwize CheckSheet "
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-other-checklist text-color-lightgray"
            ></f7-icon>
          </f7-list-item>

          <f7-list-item
            :after="firstName + lastName"
            :title="$ml.get('HOME_MSG003')"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icon>
          </f7-list-item>

          <f7-list-item
            :title="$ml.get('HOME_MSG009')"
            @click="selectTripType"
            :after="selectedTrip"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-menu-trips text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG014')"
            type="text"
            :placeholder="$ml.get('HOME_MSG014')"
            clear-button
            :value="customerName"
            @input="customerName = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icon>
          </f7-list-input>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG015')"
            type="text"
            :placeholder="$ml.get('HOME_MSG015')"
            :value="customerAddress"
            readonly
            clear-button
            @input="customerAddress = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-address text-color-lightgray"
            ></f7-icon>

            <div
              slot="content-end"
              @click.stop="isMapDeliveryAddressOpened = true"
              class="link margin-right"
            >
              <i class="f7-icons size-25 icon-address text-color-blue"></i>
            </div>
          </f7-list-input>
        </f7-list>
      </template>

      <template v-else-if="currentTrip && currentTrip.isTripStarted">
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
        <f7-toolbar bottom no-shadow class="custom-toolbar-x2 custom-toolbar">
          <div class="row width-100 padding-horizontal">
            <f7-button
              color="red"
              fill
              class="col-100text-uppercase"
              @click="endTrip(true)"
              >{{ $ml.get("COM_MSG005") }}</f7-button
            >

            <f7-button
              color="custom"
              fill
              class="col-100 margin-vertical text-uppercase"
              @click="addNewDelivery"
              >{{ $ml.get("COM_MSG039") }}</f7-button
            >
          </div>
        </f7-toolbar>

        <div v-if="!isFirstTrip">
          <f7-block-header>Trips</f7-block-header>
          <!--  {{ $ml.get("HOME_MSG022") }} -->

          <f7-list>
            <f7-list-item
              v-for="trip of completedTrips"
              :key="trip.EndTime"
              class="flex-direction-column align-items-stretch"
            >
              <f7-icon
                slot="media"
                icon="f7-icons size-25 icon-live-trip text-color-lightgray"
              ></f7-icon>

              <div class="width-100 flex-direction-column align-items-stretch">
                <div class="size-12 item-title only-2-rows">
                  <span>{{ trip.DriverCustomerName }}</span>
                  <div class="item-header text-color-gray">
                    {{ trip.BeginLocalTime }}
                  </div>
                  {{ trip.StartAddress }}
                </div>
                <div class="item-text margin-half">
                  <div class="row no-gap">
                    <div class="col-50">
                      <f7-icon
                        slot="media"
                        icon="f7-icons size-16 icon-trip-time text-color-lightgray"
                      ></f7-icon>
                      <span
                        class="
                          size-14
                          vertical-align-middle
                          margin-left-half
                          text-color-gray
                        "
                      >
                        {{ trip.Runtime }}</span
                      >
                    </div>
                    <div class="col-50">
                      <f7-icon
                        slot="media"
                        icon="f7-icons size-16 icon-menu-trips text-color-lightgray"
                      ></f7-icon>
                      <span
                        class="
                          size-14
                          vertical-align-middle
                          margin-left-half
                          text-color-gray
                        "
                        >{{ trip.Mileage }}</span
                      >
                    </div>
                    <div class="col-50">
                      <f7-icon
                        slot="media"
                        icon="f7-icons size-16 icon-trip-speed text-color-lightgray"
                      ></f7-icon>
                      <span
                        class="
                          size-14
                          vertical-align-middle
                          margin-left-half
                          text-color-gray
                        "
                        >{{ trip.MaxSpeed }}</span
                      >
                    </div>
                    <div class="col-50">
                      <f7-icon
                        slot="media"
                        icon="f7-icons size-16 icon-trip-speed text-color-lightgray"
                      ></f7-icon>
                      <span
                        class="
                          size-14
                          vertical-align-middle
                          margin-left-half
                          text-color-gray
                        "
                        >{{ trip.AvgSpeed }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="item-title size-12 only-2-rows">
                  <div class="item-header text-color-gray">
                    {{ trip.EndLocalTime }}
                  </div>
                  {{ trip.EndAddress }}
                </div>
              </div>
            </f7-list-item>
          </f7-list>
        </div>

        <f7-block-header>{{ $ml.get("HOME_MSG008") }}</f7-block-header>
        <f7-list>
          <f7-list-item
            :title="$ml.get('HOME_MSG006')"
            :after="
              currentTrip.Trip.AssetName
                ? currentTrip.Trip.AssetName
                : assetName
            "
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-other-asset text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-item
            :title="$ml.get('HOME_MSG009')"
            :after="currentTrip.Trip.TripType ? $ml.get('TextTripType') : ''"
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
        <f7-block-header>{{ $ml.get("HOME_MSG016") }}</f7-block-header>
        <f7-list>
          <f7-list-input
            :value="generalNote"
            @input="generalNote = $event.target.value"
            label="..."
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-other-notes text-color-lightgray"
            ></f7-icon>
          </f7-list-input>
        </f7-list>
        <div v-for="note of deliveryNotes" :key="note.Code">
          <f7-block-header>{{ note.Options.Header }}</f7-block-header>
          <f7-list>
            <f7-list-item
              @click="openDeliveryNotePopup(note.Code)"
              :title="note.Options.Title"
            >
              <f7-icon
                slot="media"
                icon="f7-icons size-25 icon-other-photo text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
          </f7-list>
        </div>

        <f7-block>
          <!-- :href="`/accident-report/?imei=${selectedAsset}`" -->
          <f7-link
            @click="createReport"
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
            ref="assetSelect"
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

            <!-- <div slot="content-end"  @click="scanBarCode" class="link margin-right">
              <i class="f7-icons size-25 icon-scan text-color-blue"></i>
            </div>   -->
            <select name="assetList" v-model="selectedAsset" required validate>
              <option
                v-for="asset in assetList"
                :key="asset.IMEI"
                :value="asset.IMEI"
                :disabled="!!asset.ContactCode && info.MinorToken != asset.ContactCode"
              >
                {{ asset.Name }}
              </option>
            </select>
          </f7-list-item>

          <f7-list-item
            link
            @click="showCheckList"
            class="item-input custom-smart-select-wrapper"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-other-checklist text-color-lightgray"
            ></f7-icon>

            Checklist
          </f7-list-item>

          <f7-list-item
            :after="firstName + lastName"
            :title="$ml.get('HOME_MSG003')"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icon>
          </f7-list-item>

          <f7-list-item
            :title="$ml.get('HOME_MSG009')"
            @click="selectTripType"
            :after="selectedTrip"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-menu-trips text-color-lightgray"
            ></f7-icon>
          </f7-list-item>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG014')"
            type="text"
            :placeholder="$ml.get('HOME_MSG014')"
            clear-button
            :value="customerName"
            @input="customerName = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-profile-name text-color-lightgray"
            ></f7-icon>
          </f7-list-input>
          <f7-list-input
            v-show="isBusinessTrip"
            :label="$ml.get('HOME_MSG015')"
            type="text"
            readonly
            :placeholder="$ml.get('HOME_MSG015')"
            :value="customerAddress"
            clear-button
            @input="customerAddress = $event.target.value"
          >
            <f7-icon
              slot="media"
              icon="f7-icons icon-address text-color-lightgray"
            ></f7-icon>

            <div
              slot="content-end"
              @click.stop="isMapDeliveryAddressOpened = true"
              class="link margin-right"
            >
              <i class="f7-icons size-25 icon-address text-color-blue"></i>
            </div>
          </f7-list-input>
        </f7-list>
      </template>

      <map-select-asset
        :isOpened="isMapSelectAssetOpened"
        :selectedImei="selectedAsset"
        @closePopup="isMapSelectAssetOpened = false"
        @selectAsset="onMapSelectAsset"
      />
      <map-delivery-address
        :isOpened="isMapDeliveryAddressOpened"
        @closePopup="isMapDeliveryAddressOpened = false"
        @selectAddress="onMapSelectAddress"
      />
      <delivery-note-popup
        :key="notePopupKey"
        :openPopup="isDeliveryNotePopupOpen"
        :noteDetails="noteOption"
        :savedNotes="savedNotes"
        :savedImg="savedImg"
        @closePopup="isDeliveryNotePopupOpen = false"
        @setNote="setNote"
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
import MapDeliveryAddress from "../components/map-delivery-address";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import getDifferenceBTtwoDates from "../js/helpers/get-difference-bt-two-dates";
import tFormat from "../js/helpers/time-formats";
import DeliveryNotePopup from "../components/delivery-note-popup";
import deliveryNotes from "../js/helpers/delivery-notes";
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
      isMapDeliveryAddressOpened: false,
      isImmobilised:
        localStorage.IMMOBILISATION_STATE &&
        localStorage.IMMOBILISATION_STATE === "on",
      isImmobilisationSupported: false,
      firstName: "",
      lastName: "",
      customerAddress: "",
      customerName: "",
      isBusinessTrip: false,
      selectedTrip: "",

      notePopupKey: 1,
      isDeliveryNotePopupOpen: false,
      noteOption: {},
      //faultSelectedReason: '',
      savedNotes: "",
      savedImg: "",
      deliveryNotes: [],
      notes: {},
      generalNote: "",
      newDelivery: false,
      coordsDelivery: [],
      isFirstTrip: true,
      completedTrips: [],
      assetName: "",
      boundAsset: "",
      editTripTemplate: false,

      //tripTypeText: enumTripTypes
      //user: this.$f7route.context.user,
    };
  },
  components: {
    LoginScreen,
    MapSelectAsset,
    MapDeliveryAddress,
    DeliveryNotePopup,
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
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

      this.firstName = this.info.User.FirstName;
      this.lastName = this.info.User.SubName;
      this.assetList = this.info.Devices || [];
      // this.checkLists = this.info.CheckList || [];

      if (this.assetList.length) {
        let asset = this.assetList.find((itm) => !itm.ContactCode);
        if (asset) {
          this.selectedAsset = asset.IMEI;
        }
      }



       if (this.info.TaskCode) {
          if( this.info.boundAsset) {
            let asset = this.assetList.find(
            (itm) => itm.IMEI === this.info.boundAsset
          );

          let obj = {
            isTripStarted: true,
            Trip: additionalFlags.Trip
              ? additionalFlags.Trip
              : {
                 AssetName: asset.Name,
                 AssetId: asset.ID,
                 IMEI: asset.IMEI,
                  //  StartTime: moment(params.UpdateTime).format(tFormat[0]),
                  TaskCode: this.info.TaskCode,
                  // TripType: additionalFlags.Trip.TripType,
                },
          };
          this.$store.dispatch("updateCurrentTrip", obj);
          } else {
            this.endTrip(true, true)
          }
          
        }
      // if(this.checkLists.length){
      //   this.selectedCheckList = this.checkLists[0].Code
      // }

      if (this.info.boundAsset.length) {
        this.boundAsset = this.info.boundAsset;
        this.selectedAsset = this.boundAsset;
      }
        

     

      this.showTrips();
    },
    async isLoggedIn(val) {

 

              let obj = {};

              this.$f7.methods.setInStorage({
                name: "additionalFlags",
                data: obj,
              });
      // if (val) {
      //   let additionalFlags =
      //     this.$f7.methods.getFromStorage("additionalFlags");
      //   if (
      //     !this.$f7.methods.isObjEmpty(additionalFlags) &&
      //     additionalFlags.isTripStarted &&
      //     !this.$f7.methods.isObjEmpty(additionalFlags.Trip)
      //   ) {
      //     let obj = {
      //       isTripStarted: additionalFlags.isTripStarted,
      //       Trip: additionalFlags.Trip,
      //     };
      //     this.$store.dispatch("updateCurrentTrip", obj);
      //   }

      //   let data = {
      //     MinorToken: this.info.MinorToken,
      //     MajorToken: this.info.MajorToken,
      //   };
      //   this.$f7.progressbar.show();
      //   let result = await this.$store.dispatch("GET_TRIPS_IN_PROGRESS", data);

      //   this.$f7.progressbar.hide();

      //   if (!result) {
      //     return;
      //   }
      // }
    },
    currentTrip(val) {
      console.log("currentTrip", val);

      if (val && val.isTripStarted) {
        this.componentKeyVehicle = Date.now();
        this.componentKeyChecklist = Date.now() + 1;
        let asset = this.assetList.find((itm) => itm.ID === val.Trip.AssetId);
        //  this.isImmobilisationSupported =
        //    (asset.Permissions & enumAssetPermissions.immobilisation) > 0;
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

    selectTripType(params) {
      var modalTex = `
                    <div class="custom-modal-text margin-bottom">${this.$ml.get(
                      "PROMPT_MSG010"
                    )}</div>
                    <div class="list no-margin no-hairlines text-color-black">
                        <ul>
                            <li>
                                <label class="item-radio item-content color-custom">
                                    <input type="radio" name="trip-type"
                                    
                                    value="1"  />
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${this.$ml.get(
                                          "COM_MSG014"
                                        )}</div>
                                    </div>
                                </label>
                            </li>
                             <li>
                                <label class="item-radio item-content color-custom">
                                    <input type="radio" name="trip-type" value="2"/>
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${this.$ml.get(
                                          "COM_MSG015"
                                        )}</div>
                                    </div>
                                </label>
                            </li>
                        
                            
                        </ul>
                    </div>
                `;
      this.$f7.methods.customDialog({
        text: modalTex,
        buttons: [
          {
            text: this.$ml.get("COM_MSG017"),
            onClick: async (dialog) => {
              let tripType = dialog.$el
                .find('input[name="trip-type"]:checked')
                .val();

              if (tripType === "1") {
                this.isBusinessTrip = true;
                this.selectedTrip = this.$ml.get("COM_MSG014");
              } else {
                this.isBusinessTrip = false;
                this.selectedTrip = this.$ml.get("COM_MSG015");

                this.$f7.methods.setInStorage({
                  name: "customerInfo",
                  data: {},
                });
              }

              let additionalFlags =
                this.$f7.methods.getFromStorage("additionalFlags");

              let obj = {
                isTripStarted: false,
                Trip: {
                  AssetName: Object.keys(additionalFlags).length
                    ? additionalFlags.Trip.AssetName
                    : "",
                  // AssetId: this.assetId,
                  // IMEI: this.imei,
                  // StartTime: moment(params.UpdateTime).format(tFormat[0]),
                  TaskCode: Object.keys(additionalFlags).length
                    ? additionalFlags.Trip.TaskCode
                    : this.info.TaskCode,
                  TripType: tripType,
                },
              };

              this.$f7.methods.setInStorage({
                name: "additionalFlags",
                data: obj,
              });
            },
          },
        ],
      });
    },

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

      if (!this.selectedTrip) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG042"),
        });
        return;
      }

      if (this.customerAddress && this.customerName) {
        let obj = {
          CustomerAddress: this.customerAddress,
          CustomerName: this.customerName,
          CoordsDelivery: this.coordsDelivery,
        };

        this.$f7.methods.setInStorage({
          name: "customerInfo",
          data: obj,
        });
      }

      /*this.$f7.methods.showToast(this.$ml.get('COM_MSG020'));*/

      this.$f7router.navigate({
        name: "check-list",
        query: {
          imei: this.selectedAsset,
          cheklist: this.selectedCheckList,
          isDriver: this.isDriver,
        },
      });
    },

    cancelTrip() {
      this.$f7.methods.customDialog({
        text: this.$ml.get("PROMPT_MSG043"),
        buttons: [
          {
            text: this.$ml.get("QUESTIONS_MSG001"),
            onClick: () => {
              this.endTrip(true, true);
            },
          },
          {
            text: this.$ml.get("QUESTIONS_MSG003"),
          },
        ],
      });
    },

   async editTrip() {

           let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

      if (!this.selectedTrip) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG042"),
        });
        return;
      }
 
      let data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          CustomerName:  this.customerName,
          CustomerLat : this.coordsDelivery[0],
          CustomerLng : this.coordsDelivery[1],
          TaskCode: this.info.TaskCode
            ? this.info.TaskCode
            : additionalFlags.Trip.TaskCode, //this.Trip.TaskCode,
        };

        this.$f7.progressbar.show();
        let result = await this.$store.dispatch("EDIT_TRIP", data);
        this.$f7.progressbar.hide();

        if (!result) {
          return;
        }
    },

    createReport() {
      let notesArr = [];

      for (var key in this.notes) {
        notesArr.push(this.notes[key].note);
      }
      this.$f7router.navigate("/accident-report/?imei=" + this.selectedAsset, {
        context: {
          GenralNote: this.generalNote,
          Notes: notesArr,
        },
      });
    },
    async endTrip(isFinished, toHome) {
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");
      let notesArr = [];

      for (var key in this.notes) {
        notesArr.push(this.notes[key].note);
      }

      if (isFinished) {
        let data = {
          GenralNote: this.generalNote,
          Notes: notesArr,
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          isRouteFinished: isFinished,
          TaskCode: this.info.TaskCode
            ? this.info.TaskCode
            : additionalFlags.Trip.TaskCode, //this.Trip.TaskCode,
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
          AppKey: !localStorage.PUSH_APP_KEY
            ? "123"
            : localStorage.PUSH_APP_KEY,
          Token: !localStorage.PUSH_DEVICE_TOKEN
            ? "123"
            : localStorage.PUSH_DEVICE_TOKEN,
          Type: !localStorage.DEVICE_TYPE ? "webapp" : localStorage.DEVICE_TYPE,
        });

        if (!toHome) {
          this.$f7router.navigate("/trip/?id="+additionalFlags.Trip.TaskCode+"&getList=true", {
            context: result.Data,
          });
        }

        let tripObj = {
          isTripStarted: false,
          Trip: {},
        };

        this.$f7.methods.setInStorage({
          name: "additionalFlags",
          data: tripObj,
        });
        
        this.$store.dispatch("updateCurrentTrip", tripObj);

        this.$f7.methods.setInStorage({
          name: "panelDamage",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "trailerFloor",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "trailerSidePanel",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "tyres",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "loadSheet",
          data: {},
        });
        this.$f7.methods.setInStorage({
          name: "OilWater",
          data: {},
        });
      } else {
        if (!this.selectedTrip) {
          this.$f7.methods.customDialog({
            title: this.pageTitle,
            text: this.$ml.get("PROMPT_MSG042"),
          });
          return;
        }
        let p = new Promise(async (resolve, reject) => {
          try {
            this.$f7.progressbar.show();
            let result = await this.$store.dispatch("END_TRIP", {
              GenralNote: this.generalNote,
              Notes: notesArr,
              MinorToken: this.info.MinorToken,
              MajorToken: this.info.MajorToken,
              isRouteFinished: isFinished,
              TaskCode: additionalFlags.Trip.TaskCode,
            });
            this.$f7.progressbar.hide();

            let tripObj = {
              isTripStarted: true,
              Trip: {
                AssetName: additionalFlags.Trip.AssetName,
                AssetId: this.assetId,
                IMEI: this.selectedAsset,
                //  StartTime: moment(params.UpdateTime).format(tFormat[0]),
                TaskCode: additionalFlags.Trip.TaskCode,
                TripType: additionalFlags.Trip.TripType,
              },
            };
            this.$f7.methods.setInStorage({
              name: "additionalFlags",
              data: tripObj,
            });
            this.$store.dispatch("updateCurrentTrip", tripObj);

            if (result) {
              resolve(result);
              return;
            }
          } catch (e) {
            this.$f7.progressbar.hide();
          }
        });

        p.then((data) => {
          this.startTrip();
        });
      }

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
    onMapSelectAddress(address, coords) {
      this.customerAddress = address;
      this.coordsDelivery = coords;
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
    async openDeliveryNotePopup(code) {
      this.noteOption = this.deliveryNotes.find(
        (option) => option.Code === code
      );

      //this.faultSelectedReason='';
      this.savedNotes = "";
      this.savedImg = "";

      if (this.notes[code]) {
        //this.faultSelectedReason = this.answers[code].reasonCode;
        this.savedNotes = this.notes[code].notes;
        this.savedImg = this.notes[code].img;
      } else {
        /*if(this.faultOption.Reasons && this.faultOption.Reasons.length){
            this.faultSelectedReason = this.faultOption.Reasons[0].Code;
          }*/
      }

      //fix to rerender popup and reinit smart select
      this.notePopupKey += 1;
      //await Vue.nextTick();
      await this.$nextTick();
      this.isDeliveryNotePopupOpen = true;
    },
    setNote(noteDetails) {
      //this.setQuestionState("fail", noteDetails.optionCode, faultDetails);
      this.notes[noteDetails.optionCode] = {
        ...noteDetails,
      };
      this.isDeliveryNotePopupOpen = false;
    },

    addNewDelivery() {

      this.newDelivery = true;
       this.notes = {};
      this.generalNote = "";
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

      this.assetName = additionalFlags.Trip.AssetName;
    },
    async startTrip() {
     

      if (this.customerAddress || this.customerName) {
        let obj = {
          CustomerAddress: this.customerAddress,
          CustomerName: this.customerName,
          CoordsDelivery: this.coordsDelivery,
        };

        this.$f7.methods.setInStorage({
          name: "customerInfo",
          data: obj,
        });
      }

      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");
      let customerInfo = this.$f7.methods.getFromStorage("customerInfo");

      let data = {};

      if (Object.keys(customerInfo).length == 0) {
        data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          TaskCode: additionalFlags.Trip.TaskCode,
          TripType: additionalFlags.Trip.TripType,
        };
      } else {
        data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          TaskCode: additionalFlags.Trip.TaskCode,
          TripType: additionalFlags.Trip.TripType,
          DeliveryCustomerName: customerInfo.CustomerName,
          DeliveryCustomerLat: customerInfo.CoordsDelivery[0],
          DeliveryCustomerLng: customerInfo.CoordsDelivery[1],
        };
      }

      try {
        this.$f7.progressbar.show();
        let result = await this.$store.dispatch("START_TRIP", data);
        this.$f7.progressbar.hide();
        if (!result) {
          return;
        }
      } catch (e) {
        this.$f7.progressbar.hide();
      }

      let obj = {
        isTripStarted: true,
        Trip: {
          AssetName: additionalFlags.Trip.AssetName,
          AssetId: this.assetId,
          IMEI: this.selectedAsset,
          //  StartTime: moment(params.UpdateTime).format(tFormat[0]),
          TaskCode: additionalFlags.Trip.TaskCode,
          TripType: additionalFlags.Trip.TripType,
        },
      };

      this.$f7.methods.setInStorage({
        name: "additionalFlags",
        data: obj,
      });
      this.$store.dispatch("updateCurrentTrip", obj);

      this.$store.dispatch("SET_NOTIFICATION_STATUS", {
        IMEI: this.selectedAsset,
        MinorToken: this.info.MinorToken,
        State: 1,
        MobileToken: !localStorage.PUSH_MOBILE_TOKEN
          ? "123"
          : localStorage.PUSH_MOBILE_TOKEN,
        AppKey: !localStorage.PUSH_APP_KEY ? "123" : localStorage.PUSH_APP_KEY,
        Token: !localStorage.PUSH_DEVICE_TOKEN
          ? "123"
          : localStorage.PUSH_DEVICE_TOKEN,
        Type: !localStorage.DEVICE_TYPE ? "webapp" : localStorage.DEVICE_TYPE,
      });

      this.newDelivery = false;
      this.showTrips();
    },
    async showTrips() {
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

      let params = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,
        TaskCode: this.info.TaskCode
          ? this.info.TaskCode
          : additionalFlags.Trip.TaskCode,
      };
      let items;
      if (params.TaskCode) {
        items = await this.$store.dispatch("GET_TRIPS_FROM_API", params);
      }

      if (items && items.length) {
        for (let trip in items) {
          if (items[trip].BeginTime) {
            items[trip].BeginLocalTime = moment(
              items[trip].BeginTime,
              "YYYY-MM-DD[T]HH:mm:ss"
            )
              //.add(self.$app.data.UTCOFFSET, "minutes")
              .format("YYYY-MM-DD HH:mm:ss");
          }
          if (items[trip].EndTime) {
            items[trip].EndLocalTime = moment(
              items[trip].EndTime,
              "YYYY-MM-DD[T]HH:mm:ss"
            )
              //.add(self.$app.data.UTCOFFSET, "minutes")
              .format("YYYY-MM-DD HH:mm:ss");
          }

          if (items[trip].StartLat && items[trip].StartLng) {
            items[trip].StartAddress = await this.$store.dispatch(
              "fetchAddress",
              {
                lat: items[trip].StartLat,
                lng: items[trip].StartLng,
              }
            );
          }

          if (items[trip].EndLat && items[trip].EndLng) {
            items[trip].EndAddress = await this.$store.dispatch(
              "fetchAddress",
              {
                lat: items[trip].EndLat,
                lng: items[trip].EndLng,
              }
            );
          }
        }
      }

      this.completedTrips = items;

      if (this.completedTrips && this.completedTrips.length) {
        this.isFirstTrip = false;
      }
    },
    scanBarCode() {
      if (!navigator.camera) {
        this.$f7.methods.customDialog({
          title: this.$ml.get("PROMPT_MSG000"),
          text: this.$ml.get("PROMPT_MSG007"),
        });
        return;
      }
      let options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
        encodingType: 0, // 0=JPG 1=PNG
      };
    },
  },
  created() {},
  mounted() {
    

    this.checkLists = checkList;
    this.deliveryNotes = deliveryNotes;

    this.$nextTick(() => {
      this.assetList = this.info.Devices || [];
      if (this.assetList.length) {
        let asset = this.assetList.find((itm) => itm.ContactCode == this.info.MinorToken || !itm.ContactCode);
        if (asset) {
          this.selectedAsset = asset.IMEI;
        }
      }
    });

    if (this.checkLists.length) {
      this.selectedCheckList = this.checkLists[0].Code;
    }

    if (this.currentTrip && this.currentTrip.isTripStarted) {
      this.getCurrentTripDuration();
    }
  },
};
</script>