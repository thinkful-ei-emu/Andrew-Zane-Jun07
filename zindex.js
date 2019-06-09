'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false, editing:false},
    {id: cuid(), name: 'oranges', checked: false, editing:false},
    {id: cuid(), name: 'milk', checked: true,editing:false},
    {id: cuid(), name: 'bread', checked: false, editing: false}
  ],
  hideCompleted: false,

  searchValue:null
};

function generateItemElement(item) {
  
  if(item.editing){
    //When clicking the name it will change the editing status to true in which i need and input field that will be submittable and change the name of the item.  
    return `<li data-item-id="${item.id}">
      <form id="edit-name-form" >
      <input class="edit-name-class" type="text" name="blah"/> 
      </form>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
  }
  else{
    return `
    <li data-item-id="${item.id}"> 
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
  }
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item) => generateItemElement(item)); 
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  // set up a copy of the store's items in a local variable that we will reassign to a new
  // version if any filtering of the list occurs
  let filteredItems = STORE.items;

  // if the `hideCompleted` property is true, then we want to reassign filteredItems to a version
  // where ONLY items with a "checked" property of false are included
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
    console.log('filtered items =' + filteredItems);
  }

  $('.js-search-entry').val(STORE.searchValue);

  if(STORE.searchValue){
    filteredItems=filteredItems.filter(item=>item.name.includes(STORE.searchValue));
  }
  
  
  // at this point, all filtering work has been done (or not done, if that's the current settings), so
  // we send our `filteredItems` into our HTML generation function 
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);

  
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item with id ' + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemId) {
  console.log(`Deleting item with id  ${itemId} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // First we find the index of the item with the specified id using the native
  // Array.prototype.findIndex() method. Then we call `.splice` at the index of 
  // the list item we want to remove, with a removeCount of 1.
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIdFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// Places an event listener on the checkbox for hiding completed items
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    console.log('I ran');
    toggleHideFilter();
    renderShoppingList();
  });
}
// This will set the value of the key searchValue
function setSearchValue(value){
  STORE.searchValue=value;
}
//This will  on submit take the value from search entry  and run the function set search value.
function handlefilterSearchResults(){
  $('#js-search-items-form').on('submit',event=>{
    event.preventDefault();
    const value=$('.js-search-entry').val();
    setSearchValue(value);
    renderShoppingList();
  });

}

function setEditValueToggle(itemsId){
  const index=STORE.items.findIndex(item=> item.id===itemsId);
 
  STORE.items[index].editing=!STORE.items[index].editing;
}

function handleEditClick(){
  console.log('Handle Click Edit Ran');
  $('ul').on('click','.shopping-item',event=>{
    event.preventDefault();
    const currentId=getItemIdFromElement(event.currentTarget);
    setEditValueToggle(currentId);
    renderShoppingList();

    console.log(currentId);
  });

}

function editNameValue(itemsId,value){
  const index=STORE.items.findIndex(item=>item.id===itemsId);
  STORE.items[index].name=value;
}

function handleSubmitEditedName(){
  console.log('Submitted Edited Name');
  $('ul').on('submit','#edit-name-form', event=>{
    event.preventDefault();
    const currentId=getItemIdFromElement(event.currentTarget);
    const value = $('.edit-name-class').val();
    console.log(`This is the the current id${currentId}`);
    console.log(`The new food is ${value}`);

    setEditValueToggle(currentId);
    editNameValue(currentId,value);
    renderShoppingList();
  });
}




// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handlefilterSearchResults();
  handleEditClick();
  handleSubmitEditedName();
  

}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
