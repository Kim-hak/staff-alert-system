<template>
  <div class="container py-4">

    <div class="row g-4">

      <!-- Status Card -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">

            <!-- Header -->
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="telegram-status-icon position-relative">
                <i class="bi bi-telegram" style="font-size: 50px; color: var(--primary-color)"></i>
                <span class="telegram-status-dot" :class="statusDotClass"></span>
              </div>
              <div class="d-none">
                <h3 class="fw-bold fs-4 mb-1 text-dark">ស្ថានភាពការតភ្ជាប់<span class="d-none">
                  ស្ថានភាពការតភ្ជាប់
                </span></h3>
                <p class="small mb-0 fw-semibold" :class="statusTextClass">{{ statusText }}<span class="d-none">
                  មិនទាន់បានតភ្ជាប់
                </span></p>
              </div>
              <div>
                <h3 class="fw-bold fs-4 mb-1 text-dark">ស្ថានភាពការតភ្ជាប់</h3>
                <p class="small mb-0 fw-semibold" :class="statusTextClass">
                  {{ statusText }}
                </p>
              </div>
            </div>

            <!-- Static Content -->
            <div class="bg-light border rounded-3 p-4 mb-4 d-none">
              <p class="fw-semibold text-muted mb-3">
                ភ្ជាប់គណនី Telegram របស់អ្នកដើម្បីទទួលបានការជូនដំណឹងភ្លាមៗអំពី៖
              </p>

              <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center gap-2 mb-3">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការធ្វើបច្ចុប្បន្នភាពរបាយការណ៍លទ្ធផលការងារ
                  </span>
                </li>

                <li class="d-flex align-items-center gap-2 mb-3">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការជូនដំណឹងអំពីសកម្មភាពក្រុម
                  </span>
                </li>

                <li class="d-flex align-items-center gap-2">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការដាស់តឿនប្រព័ន្ធ និងការប្រកាស
                  </span>
                </li>
              </ul>
            </div>

            <div class="bg-light border rounded-3 p-4 mb-4">
              <p class="fw-semibold text-muted mb-3">
                ភ្ជាប់គណនី Telegram របស់អ្នកដើម្បីទទួលបានការជូនដំណឹងភ្លាមៗអំពី៖
              </p>

              <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center gap-2 mb-3">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការធ្វើបច្ចុប្បន្នភាពរបាយការណ៍លទ្ធផលការងារ
                  </span>
                </li>

                <li class="d-flex align-items-center gap-2 mb-3">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការជូនដំណឹងអំពីសកម្មភាពក្រុម
                  </span>
                </li>

                <li class="d-flex align-items-center gap-2">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#84A98C;"></span>
                  <span class="fw-medium text-secondary">
                    ការដាស់តឿនប្រព័ន្ធ និងការប្រកាស
                  </span>
                </li>
              </ul>
            </div>

            <button
              v-if="!isTelegramConnected"
              class="btn text-white w-100 rounded-3 fw-semibold py-2 shadow"
              style="background:var(--primary-color);"
              :disabled="connectLoading || disconnectLoading"
              @click="openConnectModal"
            >
              <LinkIcon class="me-2" style="width:16px;height:16px;" />
              {{ connectLoading ? "Connecting..." : "ភ្ជាប់ Telegram" }}
            </button>

            <button
              v-else
              class="btn btn-outline-danger w-100 rounded-3 fw-semibold py-2"
              :disabled="connectLoading || disconnectLoading"
              @click="disconnectTelegram"
            >
              {{ disconnectLoading ? "Disconnecting..." : "ផ្តាច់ Telegram" }}
            </button>

            <p v-if="message" class="small text-center mt-3 mb-0" :class="messageClass">
              {{ message }}
            </p>

          </div>
        </div>
      </div>

      <!-- How To Connect -->
      <div class="col-12 col-lg-6">
        <div class=" card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 ">

            <h3 class="fw-bold fs-4 text-dark mb-4">
              របៀបភ្ជាប់
            </h3>

            <!-- Step 1 -->
            <div class="d-flex gap-3 mb-4">
              <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;">
                1
              </div>

              <div>
                <p class="fw-bold mb-1">ចុចប៊ូតុងភ្ជាប់</p>
                <p class="small text-muted mb-0">
                  ចុចលើប៊ូតុង "ភ្ជាប់ Telegram"
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="d-flex gap-3 mb-4">
              <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;">
                2
              </div>

              <div>
                <p class="fw-bold mb-1">បើក Telegram</p>
                <p class="small text-muted mb-0">
                  បើក Telegram App ឬ Telegram Web
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="d-flex gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;">
                3
              </div>

              <div>
                <p class="fw-bold mb-1">បញ្ជាក់ការភ្ជាប់</p>
                <p class="small text-muted mb-0">
                  អនុញ្ញាតការភ្ជាប់គណនីរបស់អ្នក
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <BaseModal
      :show="showConnectModal"
      title="បញ្ជាក់ការភ្ជាប់"
      size="md"
      @close="closeConnectModal"
    >
      <p class="text-secondary mb-0">
        អនុញ្ញាតការភ្ជាប់គណនីរបស់អ្នក
      </p>

      <template #footer>
        <button
          type="button"
          class="btn btn-light fw-semibold"
          :disabled="connectLoading"
          @click="closeConnectModal"
        >
          បោះបង់
        </button>
        <button
          type="button"
          class="btn text-white fw-semibold"
          style="background:var(--primary-color);"
          :disabled="connectLoading"
          @click="connectTelegram"
        >
          {{ connectLoading ? "Connecting..." : "យល់ព្រម" }}
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { LinkIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useAuthStore } from "@/stores/useAuth";
import api from "@/api/api";

const authStore = useAuthStore();
const connectLoading = ref(false);
const disconnectLoading = ref(false);
const showConnectModal = ref(false);
const telegramConnectedStorageKey = "telegram-connected";
const connectedOverride = ref(localStorage.getItem(telegramConnectedStorageKey) === "true" ? true : null);
const message = ref("");
const messageType = ref("");
const toast = useToast();

const hasTelegramConnectionValue = (value) => {
  if (!value || typeof value !== "object") return false;

  return Object.entries(value).some(([key, childValue]) => {
    const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");
    const childHasConnection = hasTelegramConnectionValue(childValue);

    if (
      childValue &&
      (
        (normalizedKey.includes("telegram") && typeof childValue !== "object") ||
        normalizedKey === "chatid" ||
        normalizedKey === "chat"
      )
    ) {
      return true;
    }

    return childHasConnection;
  });
};

const profileTelegramConnected = computed(() => {
  const profile = authStore.profile || {};

  return Boolean(
    profile.telegram_connected ||
    profile.telegramConnected ||
    profile.is_telegram_connected ||
    profile.isTelegramConnected ||
    profile.telegram_chat_id ||
    profile.telegramChatId ||
    profile.telegram_id ||
    profile.telegramId ||
    profile.telegram?.chat_id ||
    profile.telegram?.chatId ||
    profile.telegram?.id ||
    hasTelegramConnectionValue(profile)
  );
});

const isTelegramConnected = computed(() => {
  return connectedOverride.value ?? profileTelegramConnected.value;
});

const statusText = computed(() => {
  return isTelegramConnected.value ? "បានតភ្ជាប់" : "មិនទាន់បានតភ្ជាប់";
});

const statusTextClass = computed(() => {
  return isTelegramConnected.value ? "text-success" : "text-danger";
});

const statusDotClass = computed(() => {
  return isTelegramConnected.value ? "is-connected" : "is-disconnected";
});

const messageClass = computed(() => {
  if (messageType.value === "success") return "text-success";
  if (messageType.value === "error") return "text-danger";
  return "text-secondary";
});

const getConnectUrl = (payload) => {
  return (
    payload?.data?.url ||
    payload?.data?.link ||
    payload?.data?.telegramUrl ||
    payload?.url ||
    payload?.link ||
    payload?.telegramUrl
  );
};

const openConnectModal = () => {
  showConnectModal.value = true;
};

const closeConnectModal = () => {
  if (connectLoading.value) return;
  showConnectModal.value = false;
};

const setTelegramConnected = (value) => {
  connectedOverride.value = value;

  if (value) {
    localStorage.setItem(telegramConnectedStorageKey, "true");
  } else {
    localStorage.removeItem(telegramConnectedStorageKey);
  }
};

const syncTelegramRedirectStatus = () => {
  const params = new URLSearchParams(window.location.search);
  const status = (
    params.get("telegram") ||
    params.get("telegram_connected") ||
    params.get("connected") ||
    params.get("status")
  )?.toLowerCase();

  if (["connected", "success", "true", "1"].includes(status)) {
    setTelegramConnected(true);
  }

  if (["disconnected", "false", "0"].includes(status)) {
    setTelegramConnected(false);
  }
};

const refreshProfile = async () => {
  try {
    await authStore.fetchProfile();
  } catch (error) {
    console.error("Failed to refresh profile:", error);
  }
};

const connectTelegram = async () => {
  connectLoading.value = true;
  message.value = "";
  messageType.value = "";

  try {
    const response = await api.get("telegram/connect");
    const connectUrl = getConnectUrl(response.data);

    if (connectUrl) {
      showConnectModal.value = false;
      setTelegramConnected(true);
      window.location.href = connectUrl;
      return;
    }

    showConnectModal.value = false;
    setTelegramConnected(true);
    messageType.value = "success";
    message.value = response.data?.message || "Telegram connect request sent.";
    toast.success(message.value);
    await refreshProfile();
  } catch (error) {
    messageType.value = "error";
    message.value = error.response?.data?.message || "Failed to connect Telegram.";
    toast.error(message.value);
  } finally {
    connectLoading.value = false;
  }
};

const disconnectTelegram = async () => {
  disconnectLoading.value = true;
  message.value = "";
  messageType.value = "";

  try {
    const response = await api.post("telegram/disconnect");
    setTelegramConnected(false);
    messageType.value = "success";
    message.value = response.data?.message || "Telegram disconnected successfully.";
    toast.success(message.value);
    await refreshProfile();
  } catch (error) {
    messageType.value = "error";
    message.value = error.response?.data?.message || "Failed to disconnect Telegram.";
    toast.error(message.value);
  } finally {
    disconnectLoading.value = false;
  }
};

onMounted(async () => {
  syncTelegramRedirectStatus();

  if (!authStore.profile) {
    await refreshProfile();
  }
});
</script>

<style scoped>
.telegram-status-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 22px rgba(34, 158, 217, 0.22);
  flex: 0 0 auto;
}

.telegram-status-dot {
  position: absolute;
  right: 1px;
  bottom: 2px;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
}

.telegram-status-dot.is-connected {
  background: #198754;
}

.telegram-status-dot.is-disconnected {
  background: #dc3545;
}
</style>
