const detailBtn = document.querySelectorAll(".btn_detail");
const closeBtn = document.querySelector(".close");
const accountList = document.querySelector(".account_list");
const accountDetail = document.querySelector(".account_detail");

detailBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    accountDetail.classList.add("visible_flex");
    accountList.classList.add("blured");
  })
);
closeBtn.addEventListener("click", () => {
  accountDetail.classList.remove("visible_flex");
  accountDetail.classList.add("hidden");

  accountList.classList.remove("blured");
});
