import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { render } from "preact";

import NoteGalleryPlugin from "~/main";
import NoteGalleryApp from "~/react";
import getSettings, { Settings } from "~/code-block/settings";

export default class CodeBlockNoteGallery extends MarkdownRenderChild {
  private settings: Settings;
  private reactEl: HTMLElement;

  constructor(
    public plugin: NoteGalleryPlugin,
    public src: string,
    public containerEl: HTMLElement,
    public app: App,
    public ctx: MarkdownPostProcessorContext,
  ) {
    super(containerEl);
    this.settings = getSettings(src, app, containerEl, ctx);
  }

  async onload() {
    this.plugin.app.workspace.onLayoutReady(() => {
      const searchEl = this.containerEl.createEl("div");
      this.reactEl = this.containerEl.createEl("div");

      searchEl.style.display = "none";
      searchEl.style.overflowY = "scroll";

      const embeddedSearch = this.addChild(
        new this.plugin.EmbeddedSearch!(
          this.app,
          searchEl,
          this.settings.query,
          this.ctx.sourcePath,
        ),
      );
      render(
        <NoteGalleryApp
          app={this.app}
          component={this}
          containerEl={this.reactEl}
          sourcePath={this.ctx.sourcePath}
          settings={this.settings}
          embeddedSearch={embeddedSearch}
          db={this.plugin.db}
        />,
        this.reactEl,
      );
    });
  }

  async onunload() {
    render(null, this.reactEl);
  }
}
