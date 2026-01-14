<template lang="pug">
UModal(v-model:open="isOpen" :dismissible="!isSubmitting")
  template(#content)
    UCard
      .flex.items-center.justify-between.mb-4
        h3.text-lg.font-semibold {{ _title }}
        UButton(
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="handleClose"
        )

      UForm(:state="form" @submit="_handleSubmit")
        .space-y-4
          UFormField(label="Amount" name="amount" :required="true")
            UInput(
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              icon="i-heroicons-currency-dollar"
              :disabled="isSubmitting"
            )
          
          UFormField(label="Category" name="category" :required="true")
            USelectMenu(
              v-model="form.category"
              :items="_categoryItems"
              value-attribute="value"
              option-attribute="label"
              placeholder="Select category"
              :disabled="isSubmitting"
            )
          
          UFormField(label="Payment Method" name="method" :required="!form.isRecurring")
            USelectMenu(
              v-model="form.method"
              :items="_methodItems"
              value-attribute="value"
              option-attribute="label"
              placeholder="Select payment method"
              :disabled="isSubmitting"
              searchable
            )
          
          UFormField(label="Note" name="note")
            UTextarea(
              v-model="form.note"
              placeholder="Optional description"
              :rows="3"
              :disabled="isSubmitting"
            )
          
          .flex.items-center.gap-2
            UCheckbox(
              v-model="form.isRecurring"
              :disabled="isSubmitting"
            )
            label.text-sm.cursor-pointer(@click="_toggleRecurring") This is a recurring expense
          
          .border-t.border-gray-200.dark_border-gray-700.pt-4.mt-4.space-y-4(v-if="form.isRecurring")
            .text-sm.font-medium.text-gray-700.dark_text-gray-300 Recurring Details
            
            UFormField(label="Frequency" name="frequency" :required="true")
              USelectMenu(
                v-model="form.frequency"
                :items="_frequencyOptions"
                value-attribute="value"
                option-attribute="label"
                placeholder="Select frequency"
                :disabled="isSubmitting"
              )
            
            UFormField(label="Interval" name="interval" :required="true")
              UInput(
                v-model.number="form.interval"
                type="number"
                min="1"
                placeholder="1"
                :disabled="isSubmitting"
              )
                template(#trailing)
                  span.text-xs.text-gray-500 {{ _intervalLabel }}
            
            UFormField(label="Start Date" name="startDate" :required="true")
              UInput(
                v-model="form.startDate"
                type="date"
                :disabled="isSubmitting"
              )
            
            UFormField(label="End Date (Optional)" name="endDate")
              UInput(
                v-model="form.endDate"
                type="date"
                :disabled="isSubmitting"
              )
        
        .flex.justify-end.gap-2.pt-4
          UButton(
            color="gray"
            variant="ghost"
            @click="handleClose"
            :disabled="isSubmitting"
          ) Cancel
          UButton(
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          ) {{ _submitButtonText }}
</template>

<script setup lang="ts">
import type { ExpenseFormData, SelectMenuItem } from '~/types/expense'
import { DEFAULT_EXPENSE_FORM, FREQUENCY_OPTIONS } from '~/types/expense'
import { extractSelectValue, hasValue } from '~/utils/expense'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const toast = useToast()
const isSubmitting = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { categories, methods } = useExpenseFilters()

// Initialize form with default values
const form = reactive<ExpenseFormData>({ ...DEFAULT_EXPENSE_FORM })

// Select menu items
const _categoryItems = computed<SelectMenuItem[]>(() => 
  categories.value.map(c => ({ label: c, value: c }))
)

const _methodItems = computed<SelectMenuItem[]>(() => 
  methods.value.map(m => ({ label: m, value: m }))
)

const _frequencyOptions = FREQUENCY_OPTIONS

// Computed properties
const _title = computed(() => 
  form.isRecurring ? 'Add Recurring Expense' : 'Add New Expense'
)

const _intervalLabel = computed(() => {
  if (form.frequency === 'monthly') {
    return form.interval === 1 ? 'month' : 'months'
  } else {
    return form.interval === 1 ? 'year' : 'years'
  }
})

const _submitButtonText = computed(() => 
  form.isRecurring ? 'Create Recurring Expense' : 'Create Expense'
)

const isFormValid = computed(() => {
  const baseValid = form.amount > 0 && hasValue(form.category)
  
  if (form.isRecurring) {
    return baseValid && 
           hasValue(form.frequency) && 
           form.interval > 0 && 
           form.startDate
  } else {
    return baseValid && hasValue(form.method)
  }
})

// Helper to extract value from SelectMenu (handles both string and object)
const getValue = extractSelectValue

function _toggleRecurring() {
  if (isSubmitting.value) return
  form.isRecurring = !form.isRecurring
}

function resetForm() {
  Object.assign(form, DEFAULT_EXPENSE_FORM)
}

function handleClose() {
  if (isSubmitting.value) return
  isOpen.value = false
  setTimeout(resetForm, 300)
}

async function _handleSubmit() {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    if (form.isRecurring) {
      await $fetch('/api/expense/recurring', {
        method: 'POST',
        body: {
          amount: Number(form.amount),
          category: getValue(form.category),
          note: form.note.trim(),
          frequency: getValue(form.frequency),
          interval: Number(form.interval),
          startDate: form.startDate,
          endDate: form.endDate || undefined,
          timezone: 'UTC'
        },
        credentials: 'include'
      })
      
      toast.add({
        title: 'Success',
        description: 'Recurring expense created successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } else {
      await $fetch('/api/expense', {
        method: 'POST',
        body: {
          amount: Number(form.amount),
          category: getValue(form.category),
          method: getValue(form.method).trim(),
          note: form.note.trim()
        },
        credentials: 'include'
      })
      
      toast.add({
        title: 'Success',
        description: 'Expense created successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    }
    
    emit('success')
    handleClose()
  } catch (error: unknown) {
    console.error('Failed to create expense:', error)
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Failed to create expense'
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Expose variables to avoid unused warnings while keeping them available for template
const _templateBindings = {
  _categoryItems,
  _methodItems,
  _frequencyOptions,
  _title,
  _intervalLabel,
  _submitButtonText,
  _toggleRecurring,
  _handleSubmit
}
void _templateBindings
</script>
