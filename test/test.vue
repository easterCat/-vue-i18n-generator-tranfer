<template>
  <div class="login-container">
    <div>{{$t('test_1')}}</div>
    <div>{{$t('test_2')}}</div>
    <div>{{$t('test_3')}}</div>
    <div>{{$t('test_4')}}</div>
    <div>{{$t('test_5')}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      one: this.$t('test_6'),
      two: this.$t('test_7')
    };
  }
};
</script>
