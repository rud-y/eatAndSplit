import "./App.css";
import { useState, useEffect } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=51022",
    balance: -7,
  },
  {
    id: 933372,
    name: "Anna",
    image: "https://i.pravatar.cc/48?u=21100",
    balance: 20,
  },
  {
    id: 499476,
    name: "Donald",
    image: "https://i.pravatar.cc/48?u=41021",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(() => {
   const storedFriends = JSON.parse(localStorage.getItem("Friends")) || [];

   const uniqueFriends = Array.from(
     new Map(
       [...storedFriends, ...initialFriends].map(friend => [friend.id, friend])
     ).values()
   );


   return uniqueFriends;
  });
  const [selectedFriend, setSelectedFriend] = useState(null);
  const totalBalance = getTotalBalance();


   useEffect(() => {
   localStorage.setItem('Friends', JSON.stringify(friends));
  }, [friends])



  function handleShowAddFriend(e) {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(newFriend) {
    setFriends((allFriends) => [...allFriends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleDeleteFriend(friend) {
   const confirmDelete = window.confirm('Are you sure you want to remove this friend?');

   if(!confirmDelete) {
    return 
   } else {
    setFriends((allFriends) => allFriends.filter(f => f.id !== friend.id))
   }

  
  }

  // !!
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function getTotalBalance() {
    let balance = 0;
    friends.map((friend) => (balance += friend.balance));
    return balance;
  }

  return (
    <div className="" tabindex={0} aria-label="Entering Eat and split web app">
      <h2 className="heading">Eat-n-Split</h2>
      <div className="app">
        <div className="friends-list">
          <p className="total-balance">
            Total balance:
            <span
              className={
                totalBalance < 0 ? "red" : totalBalance > 0 ? "green" : ""
              }
            >
              £{totalBalance}
            </span>
          </p>
          <FriendsList
            tabindex={0}
            aria-label="Entering friends list"
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
            onDelete={handleDeleteFriend}
          />
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button
            aria-label="Add new friend button"
            onClick={handleShowAddFriend}
          >
            {!showAddFriend ? "Add new friend" : "Close Form"}
          </Button>
        </div>
        <div className="split-bill-block">
          {selectedFriend && (
            <FormSplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection, onDelete }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection, onDelete }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "friend-selected" : "friend-item"}>
      <div
        className="image-and-friend-name-container"
        tabindex={0}
        aria-label={`${friend.name} is selected.`}
      >
        <img src={friend.image} alt={`The face of ${friend.name}`} />
        <div className="friend-name-and-text">
          <p className="friend-name">{friend.name}</p>

          {friend.balance < 0 && (
            <p className="red">{`You owe ${friend.name} £${Math.abs(
              friend.balance
            )}`}</p>
          )}

          {friend.balance > 0 && (
            <p className="green">{`${friend.name} owes you £${Math.abs(
              friend.balance
            )}`}</p>
          )}

          {friend.balance === 0 && (
            <p className="even">{`You and ${friend.name} are even.`}</p>
          )}
        </div>
      </div>
      <div className="buttones">
        <Button onClick={() => onDelete(friend)}>{"❌"}</Button>
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </div>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=118836");

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
     alert('Enter the name of a new friend please!');
     return;
    }

    const id = Date.now();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("");
  }

  return (
    <form className="add-friend-form" onSubmit={handleFormSubmit} tabindex={0} aria-label="Entering Add new friend form">
      <label>Friend's name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Enter a new friend name"
      />

      <label>Image url:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        aria-label="Random image is generated for this input"
      />
      <Button aria-label="Add new friend to the list">Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill) {
     alert("Please enter the bill value!");
     return;
    } else if(!userExpense) {
     alert("Please enter your expense!")
     return;
    } 
    // !!
    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="split-bill-form" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value:</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense:</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name}'s' Expense:</label>
      <input type="text" disabled value={friendExpense} />

      <label>WHO IS PAYING?:</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
