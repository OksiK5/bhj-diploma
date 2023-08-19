/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
      if (!element) {
        throw new Error("Элемент не существует");
      }
      this.element = element;
      this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeTransactionButtons = this.element.querySelectorAll(
      ".transaction__remove"
    );
    const removeAccountButton = this.element.querySelector(".remove-account");

    removeTransactionButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const transactionId = event.target.dataset.id;
        this.removeTransaction(transactionId);
      });
    });

    removeAccountButton.addEventListener("click", () => {
      if (confirm("Вы действительно хотите удалить счёт?")) {
        this.removeAccount();
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    Account.remove(() => {
      this.clear();
      App.updateWidgets();
      App.updateForms();
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm("Вы действительно хотите удалить транзакцию?")) {
      Transaction.remove(id, () => {
        this.update();
        App.update();
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    Account.get(options.account_id, (account) => {
      this.renderTitle(account.name);
    });

    Transaction.list(options, (data) => {
      this.renderTransactions(data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleElement = this.element.querySelector(".content-title");
    titleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Date(date).toLocaleString("ru-RU", options);
    return formattedDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const formattedDate = this.formatDate(item.created_at);

    return `
      <div class="transaction">
        <div class="transaction__date">${formattedDate}</div>
        <div class="transaction__type">${item.type}</div>
        <div class="transaction__name">${item.name}</div>
        <div class="transaction__amount">${item.amount} руб.</div>
        <button class="btn btn-danger transaction__remove" data-id="${
          item.id}">
          <span class="fa fa-trash"></span>
        </button>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = this.element.querySelector(".content");
    contentElement.innerHTML = "";

    data.forEach((item) => {
      const transactionHTML = this.getTransactionHTML(item);
      contentElement.insertAdjacentHTML("beforeend", transactionHTML);
    });
  }
}