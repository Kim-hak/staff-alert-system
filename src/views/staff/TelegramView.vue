<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="mb-5">
      <h1 class="fw-bold display-6 text-dark mb-2">
        ការតភ្ជាប់ Telegram
      </h1>
      <p class="text-muted">
        ភ្ជាប់គណនី Telegram របស់អ្នកដើម្បីទទួលបានការជូនដំណឹង
      </p>
    </div>

    <div class="row g-4">
      <!-- Status Card -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">

            <!-- Header -->
            <div class="d-flex align-items-center gap-3 mb-4">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center shadow"
                style="width:56px;height:56px;background:#84A98C;"
              >
                <MessageSquareIcon class="text-white" style="width:28px;height:28px;" />
              </div>

              <div>
                <h3 class="fw-bold fs-4 mb-1 text-dark">
                  ស្ថានភាពការតភ្ជាប់
                </h3>

                <p
                  class="small mb-0"
                  :class="isConnected ? 'text-success' : 'text-secondary'"
                >
                  {{ isConnected ? "បានតភ្ជាប់" : "មិនទាន់បានតភ្ជាប់" }}
                </p>
              </div>
            </div>

            <!-- Connected -->
            <div v-if="isConnected">

              <div class="alert alert-success border rounded-3">
                <div class="d-flex gap-3">
                  <CheckCircleIcon
                    class="text-success flex-shrink-0"
                    style="width:20px;height:20px;"
                  />

                  <div>
                    <p class="fw-bold mb-1">
                      បានតភ្ជាប់ដោយជោគជ័យ
                    </p>

                    <p class="small mb-0 text-muted">
                      គណនី Telegram របស់អ្នកត្រូវបានភ្ជាប់។
                      អ្នកនឹងទទួលបានការជូនដំណឹងតាមរយៈ Telegram។
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-light rounded-3 p-3 border mb-4">
                <h6 class="text-uppercase text-secondary small fw-bold mb-2">
                  គណនីដែលបានភ្ជាប់
                </h6>

                <p class="fw-bold mb-0 text-dark">
                  @{{ user?.email?.split("@")[0] }}_telegram
                </p>
              </div>

              <button
                @click="handleDisconnect"
                :disabled="disconnecting"
                class="btn btn-danger w-100 rounded-3 fw-semibold py-2"
              >
                {{
                  disconnecting
                    ? "កំពុងផ្តាច់ការតភ្ជាប់..."
                    : "ផ្តាច់ការតភ្ជាប់ Telegram"
                }}
              </button>
            </div>

            <!-- Not Connected -->
            <div v-else>

              <div class="bg-light border rounded-3 p-4 mb-4">
                <p class="fw-semibold text-muted mb-3">
                  ភ្ជាប់គណនី Telegram របស់អ្នកដើម្បីទទួលបានការជូនដំណឹងភ្លាមៗអំពី៖
                </p>

                <ul class="list-unstyled mb-0">
                  <li class="d-flex align-items-center gap-2 mb-3">
                    <span
                      class="rounded-circle"
                      style="width:6px;height:6px;background:#84A98C;"
                    ></span>

                    <span class="fw-medium text-secondary">
                      ការធ្វើបច្ចុប្បន្នភាពរបាយការណ៍លទ្ធផលការងារ
                    </span>
                  </li>

                  <li class="d-flex align-items-center gap-2 mb-3">
                    <span
                      class="rounded-circle"
                      style="width:6px;height:6px;background:#84A98C;"
                    ></span>

                    <span class="fw-medium text-secondary">
                      ការជូនដំណឹងអំពីសកម្មភាពក្រុម
                    </span>
                  </li>

                  <li class="d-flex align-items-center gap-2">
                    <span
                      class="rounded-circle"
                      style="width:6px;height:6px;background:#84A98C;"
                    ></span>

                    <span class="fw-medium text-secondary">
                      ការដាស់តឿនប្រព័ន្ធ និងការប្រកាស
                    </span>
                  </li>
                </ul>
              </div>

              <button
                @click="handleGetLinkingUrl"
                :disabled="loading"
                class="btn text-white w-100 rounded-3 fw-semibold py-2 shadow"
                style="background:#84A98C;"
              >
                <LinkIcon class="me-2" style="width:16px;height:16px;" />

                {{
                  loading
                    ? "កំពុងបង្កើតតំណភ្ជាប់..."
                    : "ភ្ជាប់ Telegram"
                }}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- How To Connect -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">

            <h3 class="fw-bold fs-4 text-dark mb-4">
              របៀបភ្ជាប់
            </h3>

            <div class="d-flex flex-column gap-4">

              <div
                v-for="(step, index) in steps"
                :key="index"
                class="d-flex gap-3"
              >
                <div
                  class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style="
                    width:32px;
                    height:32px;
                    background:rgba(132,169,140,0.1);
                    color:#84A98C;
                    border:1px solid rgba(132,169,140,0.2);
                  "
                >
                  {{ index + 1 }}
                </div>

                <div>
                  <p class="fw-bold text-dark mb-1">
                    {{ step.title }}
                  </p>

                  <p class="small text-muted mb-0">
                    {{ step.desc }}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <TelegramConnectModal
      :is-open="showConnectModal"
      :linking-url="linkingUrl"
      @close="handleConnectModalClose"
      @copy="handleCopyLink"
    />
  </div>
</template>

<script setup>

import { useAuthStore } from "@/stores/useAuth";
import { useToastStore } from "@/stores/useToast";
import { computed, ref } from "vue";

// import TelegramConnectModal from "@/components/modals/TelegramConnectModal.vue";
// import { telegramApi } from "@/api/api";

const authStore = useAuthStore();
const toastStore = useToastStore();
const user = computed(() => authStore.user);

const isConnected = ref(false);
const showConnectModal = ref(false);
const linkingUrl = ref("");
const loading = ref(false);
const disconnecting = ref(false);

const steps = [
  {
    title: 'ចុចលើ "ភ្ជាប់ Telegram"',
    desc: "វានឹងបង្កើតតំណភ្ជាប់ URL តែមួយគត់សម្រាប់គណនីរបស់អ្នក",
  },
  {
    title: "បើកតំណភ្ជាប់",
    desc: "ចុចប៊ូតុង ឬចម្លងតំណភ្ជាប់ទៅកាន់កម្មវិធី Telegram របស់អ្នក",
  },
  {
    title: "ចាប់ផ្តើម Bot",
    desc: 'ចុចលើ "Start" ក្នុងប្រអប់សារ Telegram ដើម្បីបញ្ចប់ការតភ្ជាប់',
  },
];

const getResponseData = (response) => response.data?.data || response.data;

const getTelegramLink = (data) =>
  data.link || data.url || data.linkingUrl || data.linking_url || "";

const handleGetLinkingUrl = async () => {
  loading.value = true;

  try {
    const response = await telegramApi.connect();
    const link = getTelegramLink(getResponseData(response));

    if (!link) {
      toastStore.error("មិនអាចបង្កើតតំណភ្ជាប់ Telegram បានទេ");
      return;
    }

    linkingUrl.value = link;
    showConnectModal.value = true;
  } catch (err) {
    toastStore.error(
      err.response?.data?.message || "មិនអាចភ្ជាប់ Telegram បានទេ",
    );
  } finally {
    loading.value = false;
  }
};

const handleCopyLink = () => {
  navigator.clipboard
    .writeText(linkingUrl.value)
    .then(() => toastStore.success("បានចម្លងតំណភ្ជាប់ទៅកាន់ Clipboard"))
    .catch(() => toastStore.error("ការចម្លងតំណភ្ជាប់បានបរាជ័យ"));
};

const handleConnectModalClose = () => {
  showConnectModal.value = false;
  isConnected.value = true;
};

const handleDisconnect = async () => {
  disconnecting.value = true;

  try {
    await telegramApi.disconnect();
    isConnected.value = false;
    linkingUrl.value = "";
    toastStore.success("បានផ្តាច់ការតភ្ជាប់ Telegram ដោយជោគជ័យ");
  } catch (err) {
    toastStore.error(
      err.response?.data?.message || "មិនអាចផ្តាច់ការតភ្ជាប់ Telegram បានទេ",
    );
  } finally {
    disconnecting.value = false;
  }
};
</script>