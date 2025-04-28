<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
    emit('edit', props.user)
}

const handleDelete = () => {
    emit('delete', props.user)
}
</script>

<template>
    <tr>
        <td>{{ user.name + user.lastName}}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.phone }}</td>
        <td>{{ user.role }}</td>
        <td class="action-buttons">
            <button @click="handleEdit" title="Editar">
                <PencilSquareIcon class="icon" />
            </button>
            <button @click="handleDelete" title="Eliminar">
                <TrashIcon class="icon" />
            </button>
        </td>
    </tr>
</template>

<style scoped>
.action-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.icon {
    width: 24px;
    height: 24px;
    color: var(--primary);
}

button:hover .icon {
    color: var(--primary-dark);
}
</style>
