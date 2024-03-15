import { ConfigPlugin, withAndroidManifest, withDangerousMod, withMainActivity } from "@expo/config-plugins";
import * as path from "node:path";
import { promises as fs } from "node:fs";

type InsertProps = {
  /** The content to look at */
  content: string;
  /** The string to find within `content` */
  toFind: string;
  /** What to insert in the `content`, be it a single string, or an array of string that would be separated by a `\n` */
  toInsert: string | string[];
  /** A tag that will be used to keep track of which `expo-plugin-config` introduced the modification */
  tag: string;
  /** The symbol(s) to be used to begin a comment in the given `content`. If an array, the first item will be used to start the comment, the second to end it */
  commentSymbol: string | [string, string];
};

const createCommentSymbols = (commentSymbol: InsertProps["commentSymbol"]) => {
  return {
    startCommentSymbol: Array.isArray(commentSymbol) ? commentSymbol[0] : commentSymbol,
    endCommentSymbol: Array.isArray(commentSymbol) ? ` ${commentSymbol[1]}` : "",
  };
};

const createStartTag = (
  commentSymbol: InsertProps["commentSymbol"],
  tag: InsertProps["tag"],
  toInsert: InsertProps["toInsert"],
) => {
  const { startCommentSymbol, endCommentSymbol } = createCommentSymbols(commentSymbol);
  return `${startCommentSymbol} @generated begin ${tag} - expo prebuild (DO NOT MODIFY)${endCommentSymbol}`;
};

const createEndTag = (commentSymbol: InsertProps["commentSymbol"], tag: InsertProps["tag"]) => {
  const { startCommentSymbol, endCommentSymbol } = createCommentSymbols(commentSymbol);
  return `${startCommentSymbol} @generated end ${tag}${endCommentSymbol}`;
};

const createContentToInsert = (
  commentSymbol: InsertProps["commentSymbol"],
  tag: InsertProps["tag"],
  toInsert: InsertProps["toInsert"],
) => {
  const startTag = createStartTag(commentSymbol, tag, toInsert);
  const endTag = createEndTag(commentSymbol, tag);
  return `${startTag}\n${Array.isArray(toInsert) ? toInsert.join("\n") : toInsert}\n${endTag}`;
};

const insert = ({
  content,
  toFind,
  toInsert,
  tag,
  commentSymbol,
  where,
}: InsertProps & {
  where: "before" | "after" | "replace";
}): string => {
  const toInsertWithComments = createContentToInsert(commentSymbol, tag, toInsert);
  if (!content.includes(toFind)) {
    throw new Error(`Couldn't find ${toFind} in the given props.content`);
  }
  if (!content.includes(toInsertWithComments)) {
    switch (where) {
      case "before":
        content = content.replace(toFind, `${toInsertWithComments}\n${toFind}`);
        break;
      case "after":
        content = content.replace(toFind, `${toFind}\n${toInsertWithComments}`);
        break;
      case "replace":
        content = content.replace(toFind, `${toInsertWithComments}`);
        break;
    }
  }
  return content;
};

/**
 * Insert `props.toInsert` into `props.content` the line after `props.toFind`
 * @returns the modified `props.content`
 */
export const insertAfter = (props: InsertProps) => {
  return insert({ ...props, where: "after" });
};

/**
 * Insert `props.toInsert` into `props.content` the line before `props.toFind`
 * @returns the modified `props.content`
 */
export const insertBefore = (props: InsertProps) => {
  return insert({ ...props, where: "before" });
};

/**
 * Replace `props.toFind` by `props.toInsert` into `props.content`
 * @returns the modified `props.content`
 */
export const replace = (props: InsertProps) => {
  return insert({ ...props, where: "replace" });
};

/** Copies `srcFile` to `destFolder` with an optional `destFileName` or its initial name if not provided
 * @returns the path of the created file
 */
const copyFile = async (srcFile: string, destFolder: string, destFileName?: string) => {
  const fileName = destFileName ?? path.basename(srcFile);
  await fs.mkdir(destFolder, { recursive: true });
  const destFile = path.resolve(destFolder, fileName);
  await fs.copyFile(srcFile, destFile);
  return destFile;
};

const withReactNativeHealthConnect: ConfigPlugin<{
  permissionsRationaleActivityPath: string;
}> = (config, { permissionsRationaleActivityPath }) => {
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    if (!androidManifest?.application?.[0]) {
      throw new Error("AndroidManifest.xml is not valid!");
    }
    if (!androidManifest.application[0]["activity"]) {
      throw new Error("AndroidManifest.xml is missing application activity");
    }
    androidManifest.application[0]["activity"].push({
      $: {
        "android:name": ".PermissionsRationaleActivity",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [{ $: { "android:name": "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" } }],
        },
      ],
    });
    // @ts-expect-error activity-alias is not defined in the type
    if (!androidManifest.application[0]["activity-alias"]) {
      // @ts-expect-error activity-alias is not defined in the type
      androidManifest.application[0]["activity-alias"] = [];
    }
    // @ts-expect-error activity-alias is not defined in the type
    androidManifest.application[0]["activity-alias"].push({
      $: {
        "android:name": "ViewPermissionUsageActivity",
        "android:exported": "true",
        "android:targetActivity": ".PermissionsRationaleActivity",
        "android:permission": "android.permission.START_VIEW_PERMISSION_USAGE",
      },
      "intent-filter": [
        {
          action: [{ $: { "android:name": "android.intent.action.VIEW_PERMISSION_USAGE" } }],
          category: [{ $: { "android:name": "android.intent.category.HEALTH_PERMISSIONS" } }],
        },
      ],
    });

    return config;
  });
 
  config = withMainActivity(config, async (config) => {
    config.modResults.contents = insertAfter({
      content: config.modResults.contents,
      toFind: "import com.facebook.react.defaults.DefaultReactActivityDelegate;",
      toInsert: "import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate;",
      commentSymbol: "//",
      tag: "withReactNativeHealthConnect",
    });
    config.modResults.contents = insertAfter({
      content: config.modResults.contents,
      toFind: "super.onCreate(null);",
      toInsert: [
        "HealthConnectPermissionDelegate hcpd = HealthConnectPermissionDelegate.INSTANCE;",
        'hcpd.setPermissionDelegate(this, "com.google.android.apps.healthdata");',
      ],
      commentSymbol: "//",
      tag: "withReactNativeHealthConnect",
    });
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const destPath = path.resolve(projectRoot, "android/app/src/main/java/com/alanmobile");
      await copyFile(permissionsRationaleActivityPath, destPath, "PermissionsRationaleActivity.kt");
      return config;
    },
  ]);

  return config;
};

export default withReactNativeHealthConnect;