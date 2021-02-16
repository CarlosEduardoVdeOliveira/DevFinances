const Modal = {
  open(){
      document.querySelector('.modal-overlay')
      .classList.add('active')
  },
  close(){
      document.querySelector('.modal-overlay')
      .classList.remove('active')
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transaction){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
  },
}

const Transaction = {
  all: Storage.get(),
  add(transaction){
    Transaction.all.push(transaction)
    App.realod()
  },
  remove(index){
    Transaction.all.splice(index, 1)
    App.realod()
  },
  incomes(){
    let income = 0
    Transaction.all.forEach((transaction)=>{
      if(transaction.amount > 0) income += transaction.amount
    })

    return income;
  },
  expenses(){
    let expense = 0
    Transaction.all.forEach((transaction)=>{
      if(transaction.amount < 0) expense += transaction.amount
    })
    return expense;
  },
  total(){
    let cardTotal = document.querySelector(".total")
    
    if((Transaction.incomes() + Transaction.expenses() > 0)){
      cardTotal.style.background = 'var(--green)'
    }else if((Transaction.incomes() + Transaction.expenses() < 0)){
      cardTotal.style.background = 'var(--red)'
    }else{
      cardTotal.style.background = 'var(--grey)'
    }
    return Transaction.incomes() + Transaction.expenses();
  },
}

const Ultils = {
  formatAmount(value){
    value = value * 100
    return Math.round(value)
  },
  formatDate(date){
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(value){
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, "")
    value = Number(value) / 100
    value = value.toLocaleString('pt-BR', {
      style: "currency",
      currency: "BRL",
    })
    return signal + value
  } 
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    DOM.transactionContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index){
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Ultils.formatCurrency(transaction.amount)
    const html =`
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}"> ${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./public/assets/minus.svg" alt="Remover transação" />
      </td>`
    return html
  },
  updateBalance(){
    document.getElementById('incomeDisplay')
      .innerHTML = Ultils.formatCurrency(Transaction.incomes())
    document.getElementById('expenseDisplay')
      .innerHTML = Ultils.formatCurrency(Transaction.expenses())
    document.getElementById('totalDisplay')
      .innerHTML = Ultils.formatCurrency(Transaction.total())

  },

  clearTransactions(){
    DOM.transactionContainer.innerHTML = ""
  },
}


const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },
  validateFilds(){
    const {description, amount, date} = Form.getValues()
    if(description.trim() === '' || amount.trim() === '' || date.trim() === ''){
      throw new Error("Por favor preencha todos os campos!")
    }
  },
  formatValues(){
    let {description, amount, date} = Form.getValues()
    amount = Ultils.formatAmount(amount)
    date = Ultils.formatDate(date)
    return {
      description,
      amount, 
      date
    }
  },
  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  submit(event){
    event.preventDefault()
    try {
      Form.validateFilds()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
    
  }
}

const App = {
  init(){
    Transaction.all.forEach((transaction, index)=>{
      DOM.addTransaction(transaction, index)
    })
    DOM.updateBalance()
    
    Storage.set(Transaction.all)
  },
  realod(){
    DOM.clearTransactions()
    App.init()
  },
}
App.init()