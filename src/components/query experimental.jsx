import React, { Component } from "react";
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
      splitObjs: [],
      objPage: [],
      page: 0,
      filterTabs: ["Scratch Groups"],
      filterFunctions: ["groupCheckBox"],
      filteredSplitObjs: [],
      filteredObjPage: [],
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

          this.setState({
            scratchItem: {
              itemTitle: nestedItemTitles,
              itemImage: nestedItemImages,
            },
          });
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

        this.setState(
          {
            scratchGroup: {
              scratchTitle: scratchTitles,
              scratchImage: scratchImages,
            },

            //   scratchImage: nestedItemImages,
          },
          () => {
            this.createObj();
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

    // Scratch Items
    const titleLength = this.state.scratchItem.itemTitle;

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

    this.setState(
      {
        groupObjs: groupObj,
        itemObjects: itemObj,
        loadData: true,
      },
      () => {
        this.setState(
          {
            splitObjs: this.splitArray(this.state.itemObjects, 24),
          },
          () => {
            this.setState({
              objPage: this.state.splitObjs[0],
            });
          }
        );
      }
    );
  }

  async useEffect(page) {
    let newPage = this.state.page + 1;
    if (this.state.splitObjs.length === newPage) {
      return;
    } else {
      await this.setState({
        page: newPage,
        objPage: [...this.state.objPage, ...this.state.splitObjs[page]],
      });
    }
  }

  async filterEffect(page) {
    let newPage = this.state.page + 1;
    if (
      (await Math.ceil(this.state.filteredSplitObjs.length)) === newPage ||
      this.state.filteredSplitObjs.length === 0
    ) {
      return;
    } else {
      await this.setState({
        page: newPage,
        filteredObjPage: [
          ...this.state.filteredObjPage,
          ...this.state.filteredSplitObjs[page],
        ],
      });
    }
  }

  searchItem = async (e) => {
    this.setState({
      itemQuery: e.target.value.toLowerCase(),
      queryLoad: true,
    });

    this.setState(
      {
        filteredSplitObjs: this.splitArray(
          this.state.itemObjects.filter((query) =>
            query.itemTitleObj.toLowerCase().includes(this.state.itemQuery)
          ),
          24
        ),
      },
      () => {
        if (this.state.filteredSplitObjs[0] !== undefined) {
          this.setState({
            filteredObjPage: this.state.filteredSplitObjs[0],
          });
        } else return;
      }
    );
  };

  async groupScratch(scratch) {
    this.setState(
      {
        queryLoad: true,
        loadGroup: true,
      },
      () => {}
    );

    const query = scratch.toString();

    await db
      .collection("items")
      .doc(query)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.data();
        this.setState({ groupItems: data });
      });

    let groupItemObj = [];

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

    this.setState({
      groupItemObjs: groupItemObj,
      acScratchRedirect: true,
      acScratch: false,
    });
  }

  scratchGroups() {
    var groupBox = document.getElementById("groupCheckBox");

    if (groupBox.checked === true) {
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

  splitArray(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }

  redirect(item) {
    var search = item;
    console.log(search);
    window.open("https://www.google.com/search?q=" + search + "+pso2&tbm=isch");
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
          <div className="filter-container">
            <div className="form-check-label checkbox-text-scratch">
              {this.state.filterTabs.map((tab, i) => (
                <React.Fragment>
                  <h1 className="checkbox-text-styling">{tab}</h1>
                  <input
                    className="checkbox-styling"
                    type="checkbox"
                    value=""
                    id={this.state.filterFunctions[i]}
                    onClick={() => this.scratchGroups()}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>

          {this.state.loadData === true ? (
            <Container fluid className="item-container">
              <InfiniteScroll
                dataLength={
                  this.state.loadData === true
                    ? this.state.objPage.length
                    : this.state.itemQuery.length > 0
                    ? this.state.filteredObjPage.length
                    : null
                }
                hasMore={true}
                next={() => {
                  this.state.itemQuery.length > 0
                    ? this.filterEffect(this.state.page + 1)
                    : this.useEffect(this.state.page + 1);
                }}
                className="flex flex-wrap"
              >
                {this.state.itemQuery.length > 0
                  ? this.state.filteredObjPage.map((filteredItem, index) => (
                      <div className="col-cus">
                        <img
                          onClick={() =>
                            this.redirect(filteredItem.itemTitleObj)
                          }
                          alt={filteredItem.itemTitleObj}
                          className="item-image"
                          src={filteredItem.itemImageObj}
                        />

                        <h1 className="item-title">
                          {filteredItem.itemTitleObj}
                        </h1>
                      </div>
                    ))
                  : this.state.objPage.map((item, i) => (
                      <div className="col-cus">
                        <img
                          onClick={() => this.redirect(item.itemTitleObj)}
                          alt={item.itemTitleObj}
                          className="item-image"
                          src={item.itemImageObj}
                        />

                        <h1 className="item-title">{item.itemTitleObj}</h1>
                      </div>
                    ))}
              </InfiniteScroll>
            </Container>
          ) : (
            <div>
              {this.state.acScratch === true ? (
                <Container fluid className="item-container">
                  <Row>
                    {this.state.groupObjs.map((scratch, i) => (
                      <Col xs="6" md="6">
                        <img
                          alt={scratch.scratchTitleObj}
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
                              onClick={() =>
                                this.redirect(group.scratchTitleObj)
                              }
                              alt={group.scratchTitleObj}
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
      </React.Fragment>
    );
  }
}

export default Query;
