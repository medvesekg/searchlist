<template>
    <li :class="{'list-item': true, 'active' : isActive, 'list-group-item': true}">
        <slot></slot>
    </li>
</template>

<script>
export default {
    props: ['isActive'],
}
</script>
