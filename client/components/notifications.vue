<template>
  <notifications group="notes" :width="334" :max="3" :reverse="true" animation-name="notification">
    <template slot="body" slot-scope="props">
      <div :class="['note', props.item.type]">
        <b>{{props.item.title}}</b>{{ props.item.text }}
        <a href="javascript:void(0)" v-on:click="props.close"></a>
      </div>
    </template>
  </notifications>
</template>