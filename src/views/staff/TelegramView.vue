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
                <MessageSquareIcon
                  class="text-white"
                  style="width:28px;height:28px;"
                />
              </div>

              <div>
                <h3 class="fw-bold fs-4 mb-1 text-dark">
                  ស្ថានភាពការតភ្ជាប់
                </h3>
                <p class="small mb-0 text-secondary">
                  មិនទាន់បានតភ្ជាប់
                </p>
              </div>
            </div>

            <!-- Static Content -->
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
              class="btn text-white w-100 rounded-3 fw-semibold py-2 shadow"
              style="background:#84A98C;"
            >
              <LinkIcon
                class="me-2"
                style="width:16px;height:16px;"
              />
              ភ្ជាប់ Telegram
            </button>

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

            <!-- Step 1 -->
            <div class="d-flex gap-3 mb-4">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;"
              >
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
              <div
                class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;"
              >
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
              <div
                class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style="width:32px;height:32px;background:#f3f7f4;color:#84A98C;"
              >
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

  </div>
</template>