import React, { useState } from "react";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const ExploreFood = () => {
  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  return (
    <section className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card p-3 glass-surface">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <select
                    className="form-select"
                    style={{ maxWidth: "170px" }}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Burger">Burger</option>
                    <option value="Cake">Cakes</option>
                    <option value="Ice cream">Ice Creams</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Salad">Salad</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search your favorite dish..."
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FoodDisplay category={category} searchText={searchText} />
    </section>
  );
};

export default ExploreFood;
