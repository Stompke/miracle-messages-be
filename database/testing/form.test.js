const request = require("supertest");
const server = require("../../server");

const db = require("../../config/dbConfig.js");
const Volunteers = require("../../models/form-model.js");
const Interests = require("../../models/form-model.js");

describe("GET /", () => {
  it("should return 200", async () => {
    const res = await request(server).get("/api/form");
    expect(res.status).toBe(200);
  });

  it("should return json type", async () => {
    const res = await request(server).get("/api/form");
    expect(res.type).toBe("application/json");
  });
});

describe("volunteers model", () => {
  beforeEach(async () => {
    await db("volunteers").del();
  });

  describe("POST /", () => {
    it("should insert volunteers into the db", async () => {
      await Volunteers.addVolunteer({
        id: 0,
        fname: "John2",
        lname: "Smith",
        email: "jsmith@.com",
        phone: "+14802658966",
        city: "Los Angeles",
        state: "CA",
        country: "United States",
        comment: "No comment"
      });
      await Volunteers.addVolunteer({
        id: 1,
        fname: "John",
        lname: "Smith",
        email: "johnsmith@.com",
        phone: "+14802658966",
        city: "Los Angeles",
        state: "CA",
        country: "United States",
        comment: "No comment"
      });

      const volunteers = await db("volunteers");

      expect(volunteers).toHaveLength(2);
      expect(volunteers[0].fname).toBe("John2");
      expect(volunteers[0].lname).not.toBe("Jones");
      expect(volunteers[0].email).toContain("com");
      expect(volunteers[1].email).toContain("@");
      expect(volunteers[1].phone).toContain("0");
      expect(volunteers[1].state).toBe("CA");
      expect(volunteers[1].country).not.toBe("Canada");
    });
  });
});

describe("UPDATE /", () => {
  it("should update a volunteer in the db", async () => {
    await Volunteers.updateVolunteer(0, {
      fname: "Richard",
      lname: "Lovelace",
      email: "greyflanel@.com",
      phone: "+14802658966",
      city: "San Antonio",
      state: "TX",
      country: "United States",
      comment: "I got a comment"
    });
    await Volunteers.updateVolunteer(1, {
      fname: "Ron",
      lname: "Smith",
      email: "1067703@.com",
      phone: "+14802658966",
      city: "Norfolk",
      state: "VA",
      country: "United States",
      comment: "Wasn't me"
    });
    
    const volunteers = await db("volunteers");

    expect(volunteers).toHaveLength(2);
    expect(volunteers[0].fname).toEqual("Richard");
    expect(volunteers[1].email).toContain("@");
    expect(volunteers[0].city).toBe("San Antonio");
    expect(volunteers[1].comment).toContain("W");
    expect(volunteers[1].phone).not.toContain("7");
    expect(volunteers[1].state).toBe("VA");
    expect(volunteers[0].lname).not.toBe("Jones");
  });
});

describe("POST /", () => {
  it("should insert interests into the db", async () => {
    await Interests.addInterests({
      volunteersid: 0,
      volunteering: true,
      donating: true,
      joinmm: false,
      mediacoverage: false,
      somethingelse: "Hello"
    });

    await Interests.addInterests({
      volunteersid: 1,
      volunteering: true,
      donating: true,
      joinmm: false,
      mediacoverage: true,
      somethingelse: "World"
    });

    const interests = await db("interests");

    expect(interests).toHaveLength(2);
    expect(interests[0].donating).toBe(true);
    expect(interests[0].somethingelse).toContain("Hello");
    expect(interests[0].mediacoverage).toBe(false);
    expect(interests[0].volunteering).not.toBe(false);
    expect(interests[1].mediacoverage).toBe(true);
    expect(interests[1].somethingelse).toContain("World");
    expect(interests[1].joinmm).toBe(false);
  });
});

describe("UPDATE /", () => {
  it("should update an interest in the db", async () => {
    await Interests.updateInterest(0, {
      volunteersid: 0,
      volunteering: false,
      donating: false,
      joinmm: true,
      mediacoverage: true,
      somethingelse: "What's the frequency Kenneth?"
    })

    await Interests.addInterests(1, {
      volunteersid: 1,
      volunteering: false,
      donating: false,
      joinmm: false,
      mediacoverage: false,
      somethingelse: "Not again!!!!!"
    });

    const interests = await db("interests");

    expect(interests).toHaveLength(2);
    expect(interests[0].donating).not.toBe(false);
    expect(interests[0].somethingelse).not.toContain("Hello");
    expect(interests[0].mediacoverage).toBe(true);
    expect(interests[0].volunteering).not.toBe(false);
    expect(interests[1].mediacoverage).toBe(true);
    expect(interests[1].somethingelse).not.toContain("World");
    expect(interests[1].joinmm).toBe(true);
  })
})

describe("DELETE /", () => {
  it("should delete a volunteer in the db", async () => {
    await Volunteers.deleteVolunteer(1)
 
  const volunteers = await db("volunteers");

    expect(volunteers).toHaveLength(1);
   })
});