<template>
  <f7-page name="trips">
    <f7-progressbar v-if="loadingTrips" infinite class="position-absolute"></f7-progressbar>
    <f7-navbar large>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{$ml.get('SIDEBAR_MSG002')}}</f7-nav-title>
      <f7-nav-title-large>{{$ml.get('SIDEBAR_MSG002')}}</f7-nav-title-large>
      <!--<f7-nav-right>
        <f7-link icon="f7-icons icon-other-date" href="#"></f7-link>
      </f7-nav-right>-->
    </f7-navbar>

    <f7-list no-hairlines>
      <f7-list-item
        :title="$ml.get('TRIPS_MSG022')"
        smart-select
        :smart-select-params="{openIn: 'popover', closeOnSelect: true }"
        :key="componentKeyPeriod"

      >
        <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
        <select name="period" v-model="selectedPeriod" >
          <option
            v-for="period in periodList"
            :key="period.Val"
            :value="period.Val"
          >{{ period.Val === -1 ? $ml.get(period.Name) : period.Val + ' ' + $ml.get(period.Name) }}</option>
        </select>
      </f7-list-item>
      <f7-list-input
        v-if="selectedPeriod === -1"
        :label="$ml.get('COM_MSG034')"
        type="datepicker"
        :placeholder="$ml.get('COM_MSG035')"
        readonly
        :calendar-params="{ dateFormat: 'M dd yyyy', rangePicker: true, closeOnSelect: true }"
        @calendar:change="onChangeCustomPeriod"
      >
        <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
      </f7-list-input>
    </f7-list>

    <f7-block v-if="!loadingTrips && isNoData">
      <p>{{$ml.get('PROMPT_MSG012')}}</p>
    </f7-block>

    <f7-list
      ref="vlTrips"
      class="vl-trips"
      virtual-list
      :virtual-list-params="{ items, searchAll, renderExternal, height: $theme.ios ? 53 : ($theme.md ? 54 : 46)}"
    >
      <ul>
        <f7-list-item
          v-for="(item, index) in vlData.items"
          :key="index"
          :title="item.AssetName"
          :after="item.TripTypeText"
          :link="'/trip/?id=' + item.EndTime"
          :style="`top: ${vlData.topPosition}px`"
        >
          <span slot="header">{{item.BeginTime | date('', 'shortDateTime')}} - {{item.EndTime | date('', 'shortDateTime')}}</span>
        </f7-list-item>
      </ul>
    </f7-list>



  </f7-page>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import moment from 'moment'
  import tFormat from '../js/helpers/time-formats'
  import enumTripTypes from '../js/helpers/enum-trip-types'
  import historyPeriodList from '@/js/helpers/history-period-list';

  export default {
    name: "trips",
    data: ()=>({
      loadingTrips: false,
      isNoData: true,
      items: [],
      periodList: historyPeriodList,
      selectedPeriod: '',
      componentKeyPeriod: Date.now(),
      //dateFormat: tFormat[5],
      vlData: {
        items: [],
      },
    }),
    computed: {
      ...mapGetters(['info']),
    },
    methods: {
      searchAll(query, items) {
        const found = [];
        for (let i = 0; i < items.length; i += 1) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; // return array with mathced indexes
      },
      renderExternal(vl, vlData) {
        this.vlData = vlData;
      },
      formatItems(items){
        if(items.length){
          items.map((item)=>{
            item.TripTypeText = this.$ml.get(enumTripTypes[item.TripType].path)
          })
          items.sort((a, b) =>  moment(b.BeginTime).unix() - moment(a.BeginTime).unix())
        }
        return items;
      },
      async onChangeCustomPeriod(values){
        if(values.length === 2){
          let params = {
            MinorToken: this.info.MinorToken,
            MajorToken: this.info.MajorToken,

            From: moment.utc(values[0]).format(tFormat[1])+'.000Z',
            To: moment(values[1]).endOf('day').utc().format(tFormat[1])+'.000Z',
          };

          this.loadingTrips = true;
          let items = await this.$store.dispatch('GET_TRIPS_FROM_API', params);
          this.isNoData = !items.length;
          this.$refs.vlTrips.f7VirtualList.replaceAllItems(this.formatItems(items));
          this.loadingTrips = false;
        }
      }
    },
    watch: {
      async selectedPeriod(val){
        if(val && val !== -1){
          let params = {
            MinorToken: this.info.MinorToken,
            MajorToken: this.info.MajorToken,

            From: moment().subtract(val, "days").startOf('day').utc().format(tFormat[1])+'.000Z',
            To: moment().utc().format(tFormat[1])+'.000Z',
          };
          this.loadingTrips = true;
          let items = await this.$store.dispatch('GET_TRIPS_FROM_API', params);
          this.isNoData = !items.length;
          this.$refs.vlTrips.f7VirtualList.replaceAllItems(this.formatItems(items));
          this.loadingTrips = false;
        }
      }
    },
    async mounted() {

      this.selectedPeriod = 3;
      this.componentKeyPeriod = Date.now();

    }
  }
</script>

<style scoped>

</style>