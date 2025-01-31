import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#262626",
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
  },
  title: {
    fontSize: 20,
  },
  content: {
    textAlign: "center",
  },
  subTitle: {
    fontSize: 10,
  },
  textBold: {
    fontFamily: "Helvetica-Bold",
  },
  spaceX: {
    flexDirection: "row",
    alignItems: "center",
    gap: "3px",
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  table: {
    width: "100%",
    borderColor: "1px solid #f3f4f6",
    margin: "20px 0",
  },
  tableHeader: {
    backgroundColor: "#e5e5e5",
  },
  th: {
    padding: 6,
    fontSize: 10,
  },
  tr: {
    padding: 6,
    fontSize: 10,
  },
});
