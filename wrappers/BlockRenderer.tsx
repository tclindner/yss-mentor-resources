import React from "react";
import {
  ContentTypes,
  IPageFieldsItem,
  IPageItemFieldsItem,
  isIPage,
  isIPageFieldsItem,
} from "../@types/contentTypes";
import { IPage } from "../@types/generated/contentful";
import AnnouncementPreview from "../components/previews/AnnouncementPreview";
import ContentSection from "../components/views/ContentSection";
import EventPreview from "../components/previews/EventPreview";
import ExternalResourcePreview from "../components/previews/ExternalResourcePreview";
import Facilitator from "../components/views/Facilitator";
import NewsletterPreview from "../components/previews/NewsletterPreview";
import ResourcePreview from "../components/previews/ResourcePreview";
import AnnouncementCollection from "./AnnouncementCollection";
import EventCalendar from "./EventCalendar";
import FacilitatorCollection from "./FacilitatorCollection";
import NewsletterCollection from "./NewsletterWrapper";
import ResourceCollection from "./ResourceCollection";

type BlockRendererProps = {
  block: IPage | IPageFieldsItem | IPageItemFieldsItem;
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  let children: JSX.Element[] = [];

  const getKey = (content: BlockRendererProps['block']) => `${content.sys.contentType}-${content.sys.id}`;

  if (isIPage(block)) {
    // Render all page elements through BlockRenderer
    return (
      <>
        {block.fields.content.map((content) => (
          <BlockRenderer key={getKey(content)} block={content} />
        ))}
      </>
    );
  }

  if (isIPageFieldsItem(block)) {
    children = block.fields.content.map((content) => (
      <BlockRenderer key={getKey(content)} block={content} />
    ));
  }

  const contentTypeId = block.sys.contentType.sys.id;
  const Component = ContentTypeMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }

  return (
    // @ts-ignore i'm not sure why TS isn't picking up Component as the type of its map value
    <Component key={getKey(block)} entry={block}>
      {children}
    </Component>
  );
};

const ContentTypeMap = {
  [ContentTypes.Announcement]: AnnouncementPreview,
  [ContentTypes.AnnouncementCollection]: AnnouncementCollection,
  [ContentTypes.ContentSection]: ContentSection,
  [ContentTypes.Event]: EventPreview,
  [ContentTypes.EventCalendar]: EventCalendar,
  [ContentTypes.ExternalResource]: ExternalResourcePreview,
  [ContentTypes.Facilitator]: Facilitator,
  [ContentTypes.FacilitatorCollection]: FacilitatorCollection,
  [ContentTypes.Newsletter]: NewsletterPreview,
  [ContentTypes.NewsletterCollection]: NewsletterCollection,
  [ContentTypes.Resource]: ResourcePreview,
  [ContentTypes.ResourceCollection]: ResourceCollection,
};

export default BlockRenderer;
