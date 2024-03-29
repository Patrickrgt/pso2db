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
      scratchGroup: {},
      scratchImage: [],
      itemQuery: "",
      loadData: false,
      acScratch: false,
      acScratchRedirect: false,
      loadGroup: false,
      itemObjects: {},
      groupItems: [],
      groupItemObjs: {},
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

          this.setState(
            {
              scratchItem: {
                itemTitle: nestedItemTitles,
                itemImage: nestedItemImages,
              },
            },
            () => {
              console.log(this.state.scratchItem);
            }
          );
        });
      });

    db.collection("group")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        let scratchTitles = [];
        let scratchImages = [];
        for (const items in data) {
          scratchTitles.push(Object.keys(data[items]));
          scratchImages.push(Object.values(data[items]));
        }
        // console.log(scratchImages[0]);

        this.setState(
          {
            scratchGroup: {
              scratchTitle: scratchTitles,
              scratchImage: scratchImages,
            },

            //   scratchImage: nestedItemImages,
          },
          () => {
            console.log(this.state.scratchGroup);
            this.createObj();
            //   console.log(this.state.nestedItemImages);
          }
        );
      });
  }

  createObj() {
    // Scratch Groups
    const scratchTitleLength = this.state.scratchGroup.scratchTitle[0];
    const scratchImgLength = this.state.scratchGroup.scratchImage[0];

    let groupObj = [];
    for (const len in scratchTitleLength) {
      let obj = {};
      let titleS = scratchTitleLength[len];
      let imageS = scratchImgLength[len];
      obj["scratchTitleObj"] = titleS;
      obj["scratchImageObj"] = imageS;
      groupObj.push(obj);
    }

    console.log(groupObj);

    // Scratch Items
    const titleLength = this.state.scratchItem.itemTitle;
    console.log(titleLength);
    const imgLength = this.state.scratchItem.itemImage;

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
        groupObjs: groupObj,
        itemObjects: itemObj,
        // itemCallTitle: Array.from(titleLength.slice(0, 20)),
        loadData: true,
        // acScratch: true,
      },
      () => {
        console.log(this.state.itemObjects[0].itemTitleObj);
        console.log(this.state.groupObjs[0].scratchTitleObj);
        console.log(this.state.groupObjs[0].scratchImageObj);
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

  async groupScratch(scratch) {
    console.log(scratch);

    this.setState(
      {
        queryLoad: true,
        loadGroup: true,
      },
      () => {}
    );

    // db.collection("items")
    //   .doc("FUN Scratch Ticket: August 2020 - Part 2")
    //   .get()
    //   .then((querySnapshot) => {
    //     const data = querySnapshot.docs.map((doc) => doc.data());
    //     console.log(data);
    //   });

    const query = scratch.toString();
    console.log(query);

    await db
      .collection("items")
      .doc(query)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.data();
        this.setState({ groupItems: data });
      });

    let groupItemObj = [];
    let groupItemTitles = [];
    let deconsGroupItemTitle = Object.keys([this.state.groupItems][0]);
    let deconsGroupItemImage = Object.values([this.state.groupItems][0]);

    for (const len in deconsGroupItemImage) {
      let obj = {};
      let groupItemTitle = deconsGroupItemTitle[len];
      let groupItemImage = deconsGroupItemImage[len];
      obj["scratchTitleObj"] = groupItemTitle;
      obj["scratchImageObj"] = groupItemImage;
      groupItemObj.push(obj);
    }

    this.setState(
      {
        groupItemObjs: groupItemObj,
        acScratchRedirect: true,
        acScratch: false,
      },
      () => {
        console.log(this.state.groupItemObjs);

        // console.log(this.state.groupObjs[0].scratchTitleObj);
        // console.log(this.state.groupObjs[0].scratchImageObj);
      }
    );
  }

  scratchGroups() {
    var groupBox = document.getElementById("groupCheckBox");

    if (groupBox.checked == true) {
      this.setState({
        loadData: false,
        acScratch: true,
      });
    } else {
      this.setState({
        loadData: true,
        acScratch: false,
      });
    }
  }

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
          <div className="search-container">
            <input
              className="checkbox-input"
              type="checkbox"
              value=""
              id="groupCheckBox"
              onClick={() => this.scratchGroups()}
            />
            <label class="form-check-label checkbox-text">
              DISPLAY SCRATCH GROUPS
            </label>
          </div>

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
                <div>
                  {this.state.acScratch === true ? (
                    <Container fluid className="item-container">
                      <Row>
                        {this.state.groupObjs.map((scratch, i) => (
                          <Col xs="6" md="6">
                            <img
                              onClick={() =>
                                this.groupScratch(scratch.scratchTitleObj)
                              }
                              className="item-image"
                              src={scratch.scratchImageObj}
                            />

                            <h1 className="item-title">
                              {scratch.scratchTitleObj}
                            </h1>
                          </Col>
                        ))}
                      </Row>
                    </Container>
                  ) : (
                    <div>
                      {this.state.acScratchRedirect === true ? (
                        <Container fluid className="item-container">
                          <Row>
                            {this.state.groupItemObjs.map((group, i) => (
                              <Col xs="6" md="3">
                                <img
                                  className="item-image"
                                  src={group.scratchImageObj}
                                />

                                <h1 className="item-title">
                                  {group.scratchTitleObj}
                                </h1>
                              </Col>
                            ))}
                          </Row>
                        </Container>
                      ) : (
                        <div>helloworld</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Query;
