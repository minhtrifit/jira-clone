/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Image, Text, View } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { styles } from "./styles";
import { TASK_TYPE, WORKSPACE_TYPE } from "@/types";
import { formatTimeStampDate, getStatusObj } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface PropType {
  workspace: WORKSPACE_TYPE | null;
  tasks: TASK_TYPE[];
}

const TasksPdfCpn = (props: PropType) => {
  const { workspace, tasks } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.spaceX}>
            <Image style={styles.logo} src="/logo.png" />

            <View style={styles.spaceY}>
              <Text style={[styles.title, styles.textBold]}>
                {process.env.NEXT_PUBLIC_APP_NAME ?? "Jira clone"}
              </Text>
              <Text style={styles.subTitle}>copyright© minhtrifit</Text>
            </View>
          </View>

          <View style={styles.spaceY}>
            <Text style={styles.textBold}>{workspace?.name}</Text>
            <Text>Owner: {workspace?.owner?.displayName}</Text>
            <Text>
              Created Date:{" "}
              {workspace?.createdAt &&
                formatTimeStampDate(workspace?.createdAt as Timestamp, "date")}
            </Text>
          </View>
        </View>

        <View>
          <Text style={[styles.title, styles.content, styles.textBold]}>
            Workspace Tasks Monitor
          </Text>
        </View>

        <Table style={styles.table}>
          <TH style={[styles.tableHeader, styles.textBold]}>
            <TD style={styles.th}>Name</TD>
            <TD style={styles.th}>Project</TD>
            <TD style={styles.th}>Assignee</TD>
            <TD style={styles.th}>Status</TD>
            <TD style={styles.th}>Due Date</TD>
          </TH>

          {tasks?.map((task: TASK_TYPE) => (
            <TR key={task?.id}>
              <TD style={styles.tr}>{task?.name}</TD>
              <TD style={styles.tr}>{task?.project?.name}</TD>
              <TD style={styles.tr}>{task?.assignee?.displayName}</TD>
              <TD style={styles.tr}>
                {task?.status && getStatusObj(task?.status as any)?.title}
              </TD>
              <TD style={styles.tr}>
                {task?.dueAt &&
                  formatTimeStampDate(task?.dueAt as Timestamp, "datetime")}
              </TD>
            </TR>
          ))}
        </Table>
      </Page>
    </Document>
  );
};

export default TasksPdfCpn;
