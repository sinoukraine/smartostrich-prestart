<template>
  <f7-page :page-content="false">
    <f7-navbar :title="pageTitle" back-link="Back"></f7-navbar>
    <f7-toolbar tabbar top>
      <f7-link tab-link="#tab-1" tab-link-active>{{$ml.get('TRIPS_MSG001')}}</f7-link>
      <f7-link tab-link="#tab-2">{{$ml.get('TRIPS_MSG002')}}</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <slot v-if="!loading">
          <div class="gauge-rating text-align-center " >
            <f7-gauge
              v-if="trip.Gauge"
              type="semicircle"
              :value="trip.Gauge.Value"
              :value-text="trip.Gauge.Raiting"
              border-bg-color= '#8e8e93'
              :border-color="trip.Gauge.BorderColor"

              :label-text="$ml.get('TRIPS_MSG004')"
              label-text-color="#8e8e93"
            ></f7-gauge>
          </div>

          <f7-block-title class="block-title text-uppercase text-align-center margin-top text-color-black">{{$ml.get('TRIPS_MSG003')}}</f7-block-title>
          <f7-block class="block-stars text-align-center" v-html="trip.TripStat.Stars.Template">
          </f7-block>

          <!--<f7-block-title class="block-title text-uppercase text-align-center">{{$ml.get('TRIPS_MSG016')}}</f7-block-title>-->
          <f7-list class="no-hairline-top">
            <f7-list-item
              :header="$ml.get('TRIPS_MSG017')"
              :title="trip.TripStat.IMEI"
            >
              <f7-icon slot="media" icon="f7-icons icon-other-asset text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG018')"
              :title="$ml.get('TextTripType')"
            >
              <f7-icon slot="media" icon="f7-icons icon-report-trip text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG005')"
              :title="trip.TripStat.Distance + ' ' + trip.TripStat.MileageUnit"
            >
              <f7-icon slot="media" icon="f7-icons icon-trip-distance text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG006')"
              :title="trip.TripStat.Time"
            >
              <f7-icon slot="media" icon="f7-icons icon-trip-time text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG010')"
              :title="trip.TripStat.Start"
            >
              <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG011')"
              :title="trip.TripStat.Finish"
            >
              <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG007')"
              :title="trip.TripStat.MaxSpeed + ' ' + trip.TripStat.SpeedUnit"
            >
              <f7-icon slot="media" icon="f7-icons icon-trip-speed text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG008')"
              :title="trip.TripStat.AvargeSpeed + ' ' + trip.TripStat.SpeedUnit"
            >
              <f7-icon slot="media" icon="f7-icons icon-trip-speed text-color-lightgray"></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG009')"
              :title="trip.TripStat.FuelUsed + ' ' + trip.TripStat.FuelUnit"
            >
              <f7-icon slot="media" icon="f7-icons icon-trip-fuel text-color-lightgray"></f7-icon>
            </f7-list-item>

          </f7-list>
        </slot>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <playback
          v-if="!loadingPlayback"
          :historyArr="historyArr"
          :historyEvents="historyEventsArr"
          :assetName="trip.Name"
        />

        <f7-block v-else class="text-align-center">
          <f7-preloader color="gray"></f7-preloader>
        </f7-block>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Playback from '../components/trips/playback'
  import enumTripTypes from '../js/helpers/enum-trip-types'
  import moment from 'moment'
  import tFormat from '../js/helpers/time-formats'
  import parsePlaybackHisArr from '../js/helpers/parse-playback-his-arr'
  import parsePlaybackHisEvents from '../js/helpers/parse-playback-his-events'
  export default {
    name: "trip",
    data: ()=>({
      pageTitle: 'Trip',
      loading: true,
      loadingPlayback: true,
      trip: {},

      historyArr: [],
      historyEventsArr: [],
    }),
    components: {
      Playback
    },
    computed: {
      ...mapGetters(['trips', 'info']),
      mlTextTripType(){
        return enumTripTypes[this.trip.TripStat.TripType] || ''
      }
    },
    async mounted() {
      let ret = {}
      let utcOffset = moment().utcOffset();

      if(this.$f7route.context && this.$f7route.context.IMEI){
        ret = {
          Name: this.$f7route.context.Name,
          TripStat: {
            Raiting: '10',
            Stars: {},
            Distance: this.$f7route.context.Mileage, //1200,
            Time: this.$f7route.context.Runtime, //'8:56:23',
            MaxSpeed: this.$f7route.context.MaxSpeed, //'121 km/h',
            AvargeSpeed: this.$f7route.context.AvgSpeed, //'87 km/h',
            FuelUsed: this.$f7route.context.FuelUsed, //'70 L',
            Start: moment(this.$f7route.context.BeginTime).add(utcOffset,'minutes').format(tFormat[0]), //'09.01.2018 1:34 PM ',
            Finish: moment(this.$f7route.context.EndTime).add(utcOffset,'minutes').format(tFormat[0]), //'09.01.2018 4:54 PM',
            IMEI: this.$f7route.context.IMEI,
            AssetId: this.$f7route.context.ID,
            TripType: this.$f7route.context.TripType,
            SpeedUnit: 'km/h',
            FuelUnit: 'L',
            MileageUnit: 'km',
          },
          Gauge: {}
        };
        //ret.TripStat.Raiting = trip.Raiting;
        ret.TripStat.Stars = this.$f7.methods.getStars(ret.TripStat.Raiting);
        ret.Gauge = this.$f7.methods.getGaugeRaitingDetails(ret.TripStat.Raiting);

      }else{
     
        let trip = this.trips.find(trip => trip.EndTime === this.$f7route.query.id );
        ret = {
          Name: trip.AssetName,
          TripStat: {
            Raiting: '10',
            Stars: {},
            Distance: trip.Mileage,
            Time: trip.Runtime,
            MaxSpeed: trip.MaxSpeed,
            AvargeSpeed: trip.AvgSpeed,
            FuelUsed: trip.FuelUsed,
            /*Start: moment(trip.BeginTime).format(tFormat[0]),
            Finish: moment(trip.EndTime).format(tFormat[0]),*/
            Start: moment(trip.BeginTime).add(utcOffset,'minutes').format(tFormat[0]), //'09.01.2018 1:34 PM ',
            Finish: moment(trip.EndTime).add(utcOffset,'minutes').format(tFormat[0]), //'09.01.2018 4:54 PM',
            IMEI: trip.IMEI,
            AssetId: trip.ID,
            TripType: trip.TripType,
            SpeedUnit: 'km/h',
            FuelUnit: 'L',
            MileageUnit: 'km',
          },
          Gauge: {}
        };
        //ret.TripStat.Raiting = trip.Raiting;
        ret.TripStat.Stars = this.$f7.methods.getStars(ret.TripStat.Raiting);
        ret.Gauge = this.$f7.methods.getGaugeRaitingDetails(ret.TripStat.Raiting);
      }

      this.pageTitle = ret.Name;
      this.trip = ret;
      this.loading = false;


      let playbackParams = {
        MinorToken: this.info.MinorToken,

        Code: this.trip.TripStat.AssetId,
        From: moment(this.trip.TripStat.Start, tFormat[0]).utc().format(tFormat[1]),
        To: moment(this.trip.TripStat.Finish, tFormat[0]).utc().format(tFormat[1]),
      }

      let payback = await this.$store.dispatch('GET_PLAYBACK', playbackParams);
      this.loadingPlayback = false;

      if(!payback || !payback.Data || !payback.Data.HisArry || !payback.Data.HisArry.length){
       /* this.$f7.methods.customDialog({
          title: this.$ml.get('TRIPS_MSG002'),
          text: this.$ml.get('COM_MSG022')
        });*/
        return;
      }

      this.historyArr = parsePlaybackHisArr(payback.Data.HisArry);
      this.historyEventsArr = payback.Data.HisEvents && payback.Data.HisEvents.length ? parsePlaybackHisEvents(payback.Data.HisEvents) : [];

    }
  }
</script>

<style scoped>
  .gauge-rating{
    margin-top: 32px;
  }
</style>