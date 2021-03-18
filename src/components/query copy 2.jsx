import React, { Component } from "react";
import * as firebase from "firebase";
import { db } from "../store/firebase.js";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../img/arksLogo.png";
import InfiniteScroll from "react-infinite-scroll-component";

class Query extends Component {
  constructor() {
    super();

    this.state = {
      scratchTicket: [],
      scratchItem: {},
      scratchImage: [],
      itemQuery: "",
      loadData: false,
      itemObjects: {},
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

              //   scratchImage: nestedItemImages,
            },
            () => {
              console.log(this.state.loadData);
              this.createObj();
              //   console.log(this.state.nestedItemImages);
            }
          );
        });
      });
  }

  createObj() {
    const titleLength = this.state.scratchItem.itemTitle;
    const imgLength = this.state.scratchItem.itemImage;
    console.log(titleLength);
    let itemObj = [];
    for (const len in titleLength) {
      let obj = {};
      let title = titleLength[len];
      let image = imgLength[len];
      obj["itemTitleObj"] = title;
      obj["itemImageObj"] = image;
      itemObj.push(obj);
    }
    console.log(itemObj);
    this.setState(
      {
        itemObjects: itemObj,
        itemCallTitle: Array.from(titleLength.slice(0, 20)),
        loadData: true,
      },
      () => {
        console.log(this.state.itemObjects[1].itemTitleObj);
        console.log(this.state.itemCallTitle);
      }
    );
  }

  searchItem = (e) => {
    this.setState(
      {
        itemQuery: e.target.value.toLowerCase(),
        queryLoad: true,
      },
      () => {
        console.log(this.state.itemQuery);
        console.log(this.state.itemQuery.length);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <img className="logo-img" src={logo} alt="" />
        <div className="logo-container">
          <h1 className="logo-text">2</h1>
          <h1 className="logo-text">ONLINE</h1>
          <h1 className="logo-text">STAR</h1>
          <h1 className="logo-text">PHANTASY</h1>
        </div>

        <div className="search-container">
          <h1 className="search-container-logo">
            PHANTASY STAR ONLINE 2 SCRATCH TICKET DATABASE
          </h1>
          <input
            id="itemSearch"
            type="text"
            placeholder="S T A R T   S E A R C H"
            className="item-input"
            onChange={this.searchItem}
          />

          {this.state.itemQuery.length > 0 ? (
            <Container fluid className="item-container">
              <Row>
                {this.state.itemObjects
                  .filter((query) =>
                    query.itemTitleObj
                      .toLowerCase()
                      .includes(this.state.itemQuery)
                  )
                  .map((filteredItem) => (
                    <Col xs="6" md="3">
                      <img
                        className="item-image"
                        src={filteredItem.itemImageObj}
                      />
                      <h1 className="item-title">
                        {filteredItem.itemTitleObj}
                      </h1>
                      {/* <img src={item.itemImageObj} /> */}
                    </Col>
                  ))}
              </Row>
            </Container>
          ) : (
            <div>
              {this.state.loadData === true ? (
                <Container fluid className="item-container">
                  <Row>
                    {this.state.itemObjects.map((item, i) => (
                      <Col xs="6" md="3">
                        <InfiniteScroll
                          dataLength={20}
                          hasMore={true}
                          height={400}
                        >
                          <img className="item-image" src={item.itemImageObj} />

                          <h1 className="item-title">{item.itemTitleObj}</h1>
                        </InfiniteScroll>
                      </Col>
                    ))}
                  </Row>
                </Container>
              ) : (
                <div>hello world</div>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Query;
