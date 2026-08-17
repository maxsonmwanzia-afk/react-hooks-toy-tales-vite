import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  // Single source of truth for all toys — lives here because
  // ToyForm (adds) and ToyContainer (likes/donates) are siblings
  const [toys, setToys] = useState([]);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // Fetch all toys once, on initial page load
  useEffect(() => {
    fetch("http://localhost:4000/toys")
      .then((res) => res.json())
      .then((data) => setToys(data));
  }, []);

  // POST a new toy, then add it to state
  function handleAddToy(newToy) {
    fetch("http://localhost:4000/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((res) => res.json())
      .then((createdToy) => {
        setToys((prevToys) => [...prevToys, createdToy]);
      });
  }

  // PATCH likes, update that toy in place to preserve order
  function handleLikeToy(id, likes) {
    fetch(`http://localhost:4000/toys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: likes + 1 }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys((prevToys) =>
          prevToys.map((toy) => (toy.id === updatedToy.id ? updatedToy : toy))
        );
      });
  }

  // DELETE a toy, remove it from state
  function handleDonateToy(id) {
    fetch(`http://localhost:4000/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys((prevToys) => prevToys.filter((toy) => toy.id !== id));
    });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>
          {showForm ? "Close" : "Add a Toy"}
        </button>
      </div>
      <ToyContainer
        toys={toys}
        onLike={handleLikeToy}
        onDonate={handleDonateToy}
      />
    </>
  );
}

export default App;