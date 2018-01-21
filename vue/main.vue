<template>
    <div>
        <h1 v-if="text" >{{ text }}</h1>
        <h1 v-else >Hello World</h1>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
        }
    }
}
</script>

<style lang="css">

</style>
