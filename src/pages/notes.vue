<template>    
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="f7-icons size-25 icon-header-arrow" @click="backNavigate"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{ pageTitle }}</f7-nav-title>
    </f7-navbar>
    <div v-for="trip of tripList" :key="trip.EndTime">
      <f7-block-header>{{ $ml.get("HOME_MSG016") }}</f7-block-header>

      <f7-list>
        <f7-list-item header="..." :title="trip.GenralNote">
          <f7-icon slot="media" icon="f7-icons size-25 icon-other-notes text-color-lightgray"></f7-icon>
        </f7-list-item>
      </f7-list>

      <div v-for="(note, index) of trip.Notes" :key="note.Code">
        <f7-block-header v-if="index % 2 == 0">{{
        $ml.get("TRIPS_MSG026")
        }}</f7-block-header>

        <f7-block-header v-else>{{
        $ml.get("TRIPS_MSG025")
        }}</f7-block-header>

        <f7-list>
          <f7-list-item>
            <div class="top-img-wrapper">
              <div class="top-img-content">
                <img v-if="note.PhotoPath" :src="imgAddress + note.PhotoPath" alt="" />
              </div>
            </div>
          </f7-list-item>
          <f7-list-item header="Notes" :title="note.PhotoNote">
            <f7-icon slot="media" icon="f7-icons size-25 icon-other-notes text-color-lightgray"></f7-icon>
          </f7-list-item>
        </f7-list>
      </div>
    </div>
  </f7-page>
</template>

<script>
import APIMETHODS from "@/js/api-methods";
import { mapGetters } from "vuex";
import enumTripTypes from "../js/helpers/enum-trip-types";
import moment from "moment";
import tFormat from "../js/helpers/time-formats";

export default {
  name: "notes",
  data: () => ({
    pageTitle: "Photo and Notes",
    loading: true,
  
    trip: {},
    imgAddress: APIMETHODS.DOMAIN9 + "Attachment/images/",



    tripList: [],
  }),

  computed: {
    ...mapGetters(["trips", "info"]),
    mlTextTripType() {
      return enumTripTypes[this.trip.TripStat.TripType] || "";
    },
  },

  methods: {
    backNavigate() {
      this.$f7router.navigate({
        name: "trip",
        query: {
         id: this.trip.TripStat.TaskCode,
        }
      });
    },

    async getTrips(taskCode) {
      let tripsParams = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,
        TaskCode: taskCode,
      };



      let tripsFromApi = await this.$store.dispatch(
        "GET_TRIPS_FROM_API",
        tripsParams
      );



      let sortTrips = tripsFromApi.sort((a, b) => {
        return moment(a.BeginTime).diff(b.BeginTime);
      });

      this.tripList = sortTrips.filter(item => item.EndTime == this.$f7route.query.endTime);

    },


  },
  async mounted() {
    let ret = {};

    if (this.$f7route.context && this.$f7route.context.IMEI) {


      ret = {
        Name: this.$f7route.context.Name,
        TripStat: {
          IMEI: this.$f7route.context.IMEI,
          AssetId: this.$f7route.context.ID,
          TripType: this.$f7route.context.TripType,
          TaskCode: this.$f7route.query.id,
        },

      };
      this.getTrips(ret.TripStat.TaskCode);
    } else {
      let trip = this.trips.find(
        (trip) => trip.TaskCode === this.$f7route.query.id
      );
      ret = {
        TripStat: {
          IMEI: trip.IMEI,
          AssetId: trip.ID,
          TripType: trip.TripType,
          TaskCode: trip.TaskCode,
        },
        Gauge: {},
      };
      this.getTrips(trip.TaskCode);
    }


    this.trip = ret;
    this.loading = false;





  },
};

</script>