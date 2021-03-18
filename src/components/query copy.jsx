import React, { Component } from "react";
import * as firebase from "firebase";
import { db } from "../store/firebase.js";

class Query extends Component {
  constructor() {
    super();

    this.state = {
      scratchTicket: [],
      scratchItem: {},
      scratchImage: [],
      itemQuery: "",
      loadData: false,
    };
  }

  componentDidMount() {
    db.collection("items")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        this.setState({ scratchTicket: data }, () => {
          const itemKeys = this.state.scratchTicket;
          let itemTitles = [];
          let itemImages = [];
          let nestedItemTitles = [];
          let nestedItemImages = [];
          //   First iteration to get all items from all Scratch Tickets
          for (const items in itemKeys) {
            itemTitles.push(Object.keys(itemKeys[items]));
            itemImages.push(Object.values(itemKeys[items]));
          }
          //   Second iteration to get all items within each Scratch Ticket (Nested/j iteration)
          for (const items in itemTitles) {
            for (const nestedItems in itemTitles[items]) {
              nestedItemTitles.push(itemTitles[items][nestedItems]);
              nestedItemImages.push(itemImages[items][nestedItems]);
            }
          }

          //   console.log(nestedItemTitles);
          //   console.log(nestedItemImages);

          this.setState(
            {
              scratchItem: {
                itemTitle: nestedItemTitles,
                itemImage: nestedItemImages,
              },
              loadData: true,
              //   scratchImage: nestedItemImages,
            },
            () => {
              console.log(this.state.loadData);
              //   console.log(this.state.nestedItemImages);
            }
          );
        });
      });
  }

  searchItem = (e) => {
    let filterTitleArray = this.state.scratchItem.itemTitle;
    let filterImageArray = this.state.scratchItem.itemImage;
    this.setState(
      {
        itemQuery: e.target.value,
      },
      () => {
        let itemResults = filterTitleArray.filter((list) =>
          list.includes(this.state.itemQuery)
        );
        let imageResults = filterImageArray;
        this.setState({
          scratchItem: { itemTitle: itemResults, itemImage: imageResults },
        });
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <input
          id="itemSearch"
          type="text"
          placeholder="Enter item to be searched"
          onChange={this.searchItem}
        />

        {this.state.loadData === true ? (
          <div>
            {this.state.scratchItem.itemTitle.map((item, i) => (
              <div>
                <h1>{item}</h1>
                <img src={this.state.scratchItem.itemImage[i]} />
              </div>
            ))}
          </div>
        ) : (
          <div>hello world</div>
        )}

        {/* <div>
          {this.state.scratchItem.itemTitle.map((item, i) => (
            <div>
              <h1>{item}</h1>
            </div>
          ))}
        </div> */}

        {/* <div>
            {this.state.scratchItem.itemTitle.map((item, i) => (
              <div>
                <h1>{item}</h1>
                <h1>{this.state.scratchItem.itemImage[i]}</h1>
              </div>
            ))}
          </div> */}
      </React.Fragment>
    );
  }
}

export default Query;
