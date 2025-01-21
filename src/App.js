import "./App.css";
import { useState, useEffect } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=217836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Anna",
    image: "https://i.pravatar.cc/48?u=653372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Donald",
    image: "https://i.pravatar.cc/48?u=889476",
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
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    setFriends(initialFriends);
  }, []);

  function handleShowAddFriend(e) {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(newFriend) {
    setFriends((allFriends) => [...allFriends, newFriend]);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
  }

  // !!
  function handleSplitBill(value) {
    console.log("value :: ", value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="friends-list">
        <h2>Eat-n-Split</h2>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        <div className="add-friend-form-with-button">
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>
            {!showAddFriend ? "Add new friend" : "Close"}
          </Button>
        </div>
      </div>

      <hr />
      <div className="split-bill-block">
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "friend-selected" : "friend-item"}>
      <img src={friend.image} alt="A profile pic of a person" />
      <p>{friend.name}</p>
      {friend.balance < 0 && (
        <p className="red">{`You owe ${friend.name} ${Math.abs(
          friend.balance
        )}`}</p>
      )}

      {friend.balance > 0 && (
        <p className="green">{`${friend.name} owes you ${Math.abs(
          friend.balance
        )}`}</p>
      )}

      {friend.balance === 0 && <p>{`You and ${friend.name} are even.`}</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=118836");

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = Date.now();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    console.log("new friend: ", newFriend);
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>Friend's name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image url:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
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

    if (!bill || !userExpense) return;
    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
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

      <label>WHO IS PAYING THE BILL?:</label>
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
