// topicsHelper defined in topicsHelper.js
const MAX_ALLOWED_TOPICS = 4
const data = Object.assign({
  selectedTopicSlugs: [],
  userEmail: '',
  MAX_ALLOWED_TOPICS,
  subscribing: false,
  success: false,
  error: false
}, topicsHelper)

const computed = {
  selectedTopics() {
    return this.selectedTopicSlugs.map(topic => this.topics.find(({slug}) => slug == topic))
  },
  canAddMore() {
    return this.selectedTopicSlugs.length < MAX_ALLOWED_TOPICS
  },
  canSubscribe() {
    const { userEmail, selectedTopicSlugs: tags } = this
    return userEmail.length && tags.length
  },
  notification() {
    return this.success || this.error
  }
}

const methods = {
  isSelected({slug}) {
    return this.selectedTopicSlugs.includes(slug)
  },
  addSelection({slug}) {
    if (!this.canAddMore) {
      this.selectedTopicSlugs.shift()
    }
    this.selectedTopicSlugs.push(slug)
  },
  removeSelection({ slug }) {
    this.selectedTopicSlugs = this.selectedTopicSlugs.filter(topic => topic != slug)
  },
  toggleSelection(topic) {
    if (this.isSelected(topic)) {
      this.removeSelection(topic)
    } else {
      this.addSelection(topic)
    }
  },
  onSubscribe() {
    const { userEmail, selectedTopicSlugs: tags, canSubscribe, subscribing } = this
    if (!canSubscribe || subscribing) {
      return
    }

    this.subscribing = true
    const params = { userEmail, tags }
    apiClient.subscribeUserToTags(params)
      .then(({status, statusDescription }) => {
        this.subscribing = false
        this.success = status == 'ACTIVE' && `You have been subscribed! You will get your first email tomorrow. Thank you!`
        this.error = status == 'ERROR' && statusDescription
        setTimeout(() => {
          this.success = false
          this.error = false
        }, 5000)
      })
      .catch(error => {
        this.subscribing = false
        this.success = false
        this.error = `Oh no!! There's an error: ${error.message}. Please try again :)`
      })
  }
}

const el = '#app'

const app = new Vue({
  el,
  data,
  computed,
  methods
})
