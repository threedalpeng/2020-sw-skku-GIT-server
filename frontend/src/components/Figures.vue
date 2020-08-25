<template>
  <dir class ="Figures">
        <dir class = "n_person">
            현재 인원 수 : {{ figures.n_person }} <br>
        </dir>
        <dir class = "n_mask_off">
            마스크 OFF : {{ figures.n_mask_on }} <br>
        </dir>
        <dir class = "n_mask_on">
            마스크 ON : {{ figures.n_mask_on }} <br>
        </dir>
        <dir class= "n_mask_unknown">
            UNKNOWN : {{ figures.n_mask_unknown }} <br>
        </dir>
    </dir>
</template>

<script>

  export default {
    name: 'Figure',
    props: {
      figures: {type: Object},
    }
  }
</script>
