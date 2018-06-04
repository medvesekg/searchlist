<template>
    <li :class="{'list-item': true, 'active' : isActive, 'list-group-item': true}">
        <slot></slot>
    </li>
</template>

<script>
export default {
    props: ['isActive', 'id'],

}
</script>

<style scoped>
    .list-item:hover {
        color: rgba(0,0,0,.5);
    }
</style>

