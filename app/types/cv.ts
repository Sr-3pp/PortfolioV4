export interface CvContact {
  website?: string | null
  linkedin?: string | null
  email?: string | null
}

export interface CvExperience {
  company?: string | null
  role?: string | null
  start_date?: string | number | null
  end_date?: string | number | null
  highlights?: string[]
}

export interface CvProject {
  name?: string | null
  description?: string | null
  link?: string | null
}

export interface CvEducation {
  program?: string | null
  institution?: string | null
  start_year?: number | null
  end_year?: number | null
}

export interface CvSkills {
  frontend?: string[]
  backend?: string[]
  tools?: string[]
  languages?: string[]
}

export interface CvData {
  name?: string | null
  title?: string | null
  contact?: CvContact
  profile?: string | null
  experience?: CvExperience[]
  freelance_projects?: CvProject[]
  education?: CvEducation[]
  skills?: CvSkills
  source?: string | null
}

export type CvDocument = { meta?: CvData } | null
export type DateLike = string | number | null | undefined
