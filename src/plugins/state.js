import { ref, computed, watch, watchEffect } from 'vue'

export const userdata = ref({})

export const SS = window.sessionStorage
export const LS = window.localStorage
export const AS = ref({}) // affairs
export const A = ref(null) // affair
export const U = JSON.parse(SS.user || 'null')
export const CS = ref({ // configs
  code: false // show affair code
})

export const token = () => ({ headers: { token: SS.token } })

// computed
export const US = computed(() => { // users
  const res = {}
  for (const g in userdata.value) {
    for (const u in userdata.value[g]) {
      res[u] = [userdata.value[g][u], g]
    }
  }
  return res
})
export const GS = computed(() => { // groups
  if (!U.group) return {}
  const res = { [U.group]: 1 }
  for (const g in userdata.value) {
    if (!Object.keys(userdata.value[g]).length) continue
    for (let i = U.group.length; i < g.length; i++) {
      if (g[i] == '/') res[g.substr(0, i + 1)] = 1
    }
  }
  return res
})

// initialize from cache
userdata.value = LS.userdata ? JSON.parse(LS.userdata) : {}
AS.value = LS.affairs ? JSON.parse(LS.affairs) : {}

// sync to cache
watchEffect(() => {
  const s = JSON.stringify(userdata.value)
  if (LS.userdata == s) return
  else LS.userdata = s
  console.log('userdata updated')
})
watchEffect(() => {
  const s = JSON.stringify(AS.value)
  if (LS.affairs == s) return
  else LS.affairs = s
  console.log('affairs updated')
})

// only called by other window
window.addEventListener('storage', e => {
  if (e.key == 'userdata') userdata.value = JSON.parse(e.newValue)
  if (e.key == 'affairs') AS.value = JSON.parse(e.newValue)
})
