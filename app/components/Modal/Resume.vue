<template lang="pug">
UDrawer.modal-resume(v-model:open="open" description="My Resume" direction="top")
  template(#title)
    .flex.items-center.justify-between.gap-3.w-full
      span.text-lg.font-semibold My Resume
      UButton(icon="i-heroicons-printer" size="sm" variant="soft" color="primary" @click="printCv") Print

  template(#body)
    section.cv-print.mx-auto.max-w-3xl.bg-white.text-gray-900.rounded-md.shadow-sm.p-6
      header.border-b.pb-4.mb-6
        h1.text-2xl.font-bold.leading-tight {{ cv.name }}
        p.text-sm.text-gray-600 {{ cv.title }}
        ul.flex.flex-wrap.items-center.gap-3.mt-3.text-sm.text-blue-600
          li(v-if="cv.contact?.website")
            a(:href="cv.contact.website" target="_blank" rel="noopener" class="hover:underline") {{ shortUrl(cv.contact.website) }}
          li(v-if="cv.contact?.linkedin")
            a(:href="cv.contact.linkedin" target="_blank" rel="noopener" class="hover:underline") LinkedIn
          li(v-if="cv.contact?.email")
            a(:href="`mailto:${cv.contact.email}`" class="hover:underline") {{ cv.contact.email }}

      section.mb-6(v-if="cv.profile")
        h2.text-lg.font-semibold.mb-2 Profile
        p.text-sm.leading-relaxed.text-gray-700 {{ cv.profile }}

      section.mb-6(v-if="cv.experience?.length")
        h2.text-lg.font-semibold.mb-3 Experience
        ul.space-y-4
          li(v-for="(job, idx) in cv.experience" :key="idx")
            .flex.items-start.justify-between.gap-4
              .min-w-0
                h3.font-semibold.leading-tight {{ job.role }}
                p.text-sm.text-gray-600 {{ job.company }}
              p.text-xs.text-gray-500.whitespace-nowrap {{ formatRange(job.start_date, job.end_date) }}
            ul.list-disc.list-inside.text-sm.text-gray-700.mt-2
              li(v-for="(h, hIdx) in job.highlights" :key="hIdx") {{ h }}

      section.mb-6(v-if="cv.freelance_projects?.length")
        h2.text-lg.font-semibold.mb-2 Freelance Projects
        ul.space-y-2
          li(v-for="(fp, fIdx) in cv.freelance_projects" :key="fIdx")
            p.text-sm
              span.font-medium {{ fp.name }}:
              span.text-gray-700  {{ ' ' + fp.description }}
            UButton.mt-1(v-if="fp.link" :href="fp.link" target="_blank" rel="noopener" size="xs" variant="soft" icon="i-heroicons-arrow-top-right-on-square") View project

      section.mb-6(v-if="cv.education?.length")
        h2.text-lg.font-semibold.mb-2 Education
        ul.space-y-2
          li(v-for="(ed, eIdx) in cv.education" :key="eIdx")
            .flex.items-center.justify-between.gap-4
              p.text-sm
                span.font-medium {{ ed.program }}
                span.text-gray-600(v-if="ed.institution")  · {{ ed.institution }}
              p.text-xs.text-gray-500 {{ formatEduYears(ed.start_year, ed.end_year) }}

      section(v-if="cv.skills")
        h2.text-lg.font-semibold.mb-2 Skills
        div(class="grid grid-cols-1 sm:grid-cols-3 gap-4")
          div
            p.text-xs.uppercase.tracking-wide.text-gray-500.mb-1 Frontend
            ul.flex.flex-wrap.gap-2
              li(v-for="(s, i) in (cv.skills.frontend || [])" :key="'f'+i")
                UBadge(variant="soft" size="xs") {{ s }}
          div
            p.text-xs.uppercase.tracking-wide.text-gray-500.mb-1 Backend
            ul.flex.flex-wrap.gap-2
              li(v-for="(s, i) in (cv.skills.backend || [])" :key="'b'+i")
                UBadge(variant="soft" size="xs") {{ s }}
          div
            p.text-xs.uppercase.tracking-wide.text-gray-500.mb-1 Tools
            ul.flex.flex-wrap.gap-2
              li(v-for="(s, i) in (cv.skills.tools || [])" :key="'t'+i")
                UBadge(variant="soft" size="xs") {{ s }}
</template>

<script lang="ts" setup>
import type { CvData, CvDocument, DateLike } from '~/types/cv'

const { open } = useUiOverlay('resume')

const { data } = await useAsyncData<CvDocument>('cv', () => queryCollection('cv').first())

const cv = computed<CvData>(() => data.value?.meta ?? {})

const printCv = () => {
  if (import.meta.client) window.print()
}

const shortUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const normalizeRangeValue = (value: DateLike): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return String(value)

  const numeric = String(value)
  if (/^\d{4}-\d{2}$/.test(numeric)) {
    const [year, month] = numeric.split('-').map(Number)
    const date = new Date(year as number, (month ?? 1) - 1, 1)
    return date.toLocaleString(undefined, { month: 'short', year: 'numeric' })
  }
  if (/^\d{4}$/.test(numeric)) return numeric
  return numeric
}

const formatRange = (start?: DateLike, end?: DateLike) => {
  const startLabel = normalizeRangeValue(start)
  const endLabel = normalizeRangeValue(end) || 'Present'
  return [startLabel, endLabel].filter(Boolean).join(' – ')
}

const formatEduYears = (start?: number | null, end?: number | null) => {
  const startLabel = start ?? ''
  const endLabel = end ?? 'Present'
  return [startLabel, endLabel].filter(Boolean).join(' – ')
}

const templateBindings = {
  open,
  cv,
  printCv,
  shortUrl,
  formatRange,
  formatEduYears,
};

void templateBindings;
</script>

<style>
@media print {
  body * { visibility: hidden !important; overflow: visible !important; height: auto !important; transform: inherit !important;}

  body #__nuxt {
    position: absolute !important;
  }

  body [data-vaul-drawer]{
    position: static !important;
  }

  .cv-print, .cv-print * { visibility: visible !important; }

  html:has(.cv-print), body:has(.cv-print), body *:has(.cv-print) { visibility: visible !important; }

  .cv-print { position: static !important; inset: auto !important; box-shadow: none !important; background: white !important;}

  @page { margin: 6mm; }
}
</style>
