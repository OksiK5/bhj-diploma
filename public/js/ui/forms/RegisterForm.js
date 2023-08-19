/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if (!err && response.success) {
        this.reset();
        App.setState('user-logged');
        const modal = this.element.closest('.modal');
        if (modal) {
          const modalInstance = App.getInstance(modal);
          modalInstance.close();
        }
      }
    });
  }
}