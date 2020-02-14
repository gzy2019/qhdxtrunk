<template>
    <div>
      <StatsStaff :selectTeacher="true"/>
    </div>
</template>

<script>
import StatsStaff from './paypointstats-staff'
export default {
  name: 'PaypointStats-manage',
  components: { StatsStaff }
}
</script>
