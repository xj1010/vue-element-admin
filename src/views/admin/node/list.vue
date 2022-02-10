<template>
  <el-container style="height: 600px; border: 1px solid #eee">
    <el-aside width="200px">
      <div><ul id="treeDemo" class="ztree"></ul></div>
    </el-aside>
    <el-main>
      <div class="filter-container">
        <el-input v-model="listQuery.name" :placeholder="$t('菜单名称')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate(0,'createf')">创建父级菜单</el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出节点</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        height="500"
      >
        <el-table-column :label="$t('ID')" prop="id" sortable="custom" align="center" width="75">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('菜单名称')" min-width="100px">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('权限标识')" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.permission_name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('路由地址')" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.path}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('菜单类型')" align="center" width="95">
          <template slot-scope="scope">
            <span>{{ scope.row.level | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('状态')" class-name="status-col" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | colorFilter ">{{ scope.row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('图标')" width="70px" align="center">
          <template slot-scope="scope">
            <i v-bind:class=" scope.row.icon "></i>
          </template>
        </el-table-column>
        <el-table-column :label="$t('排序')" class-name="status-col" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" align="center" width="300"   fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.pid == 0" icon="el-icon-plus" size="small" @click="handleCreate(scope.row.id,'creates')">创建子菜单</el-button>
            <el-button type="primary" v-else-if="scope.row.level == 2" icon="el-icon-plus" size="small" @click="handleCreate(scope.row.id,'createz')">创建功能点</el-button>
            <el-button type="primary" v-else disabled="" size="small" icon="el-icon-plus" @click="handleCreate(scope.row.id)">创建功能点</el-button>
            <el-button  size="small" type="success" @click="handleUpdate(scope.row)"><svg-icon icon-class="edit" /> 编辑</el-button>
            <el-button  size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
        <el-dialog
          width="30%"
          title="选择图标"
          :visible.sync="innerVisible"
          append-to-body>
          <template>
            <div class="icon">
              <i @click="checkIcon('el-icon-platform-eleme')" class='el-icon-platform-eleme'></i><i @click="checkIcon('el-icon-delete-solid')" class='el-icon-delete-solid'></i><i @click="checkIcon('el-icon-eleme')" class='el-icon-eleme'></i><i @click="checkIcon('el-icon-c-scale-to-original')" class='el-icon-c-scale-to-original'></i><i @click="checkIcon('el-icon-sort-up')" class='el-icon-sort-up'></i><i @click="checkIcon('el-icon-sort-down')" class='el-icon-sort-down'></i><i @click="checkIcon('el-icon-upload')" class='el-icon-upload'></i><i @click="checkIcon('el-icon-goods')" class='el-icon-goods'></i><i @click="checkIcon('el-icon-video-pause')" class='el-icon-video-pause'></i><i @click="checkIcon('el-icon-video-play')" class='el-icon-video-play'></i><i @click="checkIcon('el-icon-s-cooperation')" class='el-icon-s-cooperation'></i><i @click="checkIcon('el-icon-s-order')" class='el-icon-s-order'></i><i @click="checkIcon('el-icon-s-platform')" class='el-icon-s-platform'></i><i @click="checkIcon('el-icon-s-unfold')" class='el-icon-s-unfold'></i><i @click="checkIcon('el-icon-s-operation')" class='el-icon-s-operation'></i><i @click="checkIcon('el-icon-s-promotion')" class='el-icon-s-promotion'></i><i @click="checkIcon('el-icon-s-home')" class='el-icon-s-home'></i><i @click="checkIcon('el-icon-s-release')" class='el-icon-s-release'></i><i @click="checkIcon('el-icon-s-ticket')" class='el-icon-s-ticket'></i><i @click="checkIcon('el-icon-s-management')" class='el-icon-s-management'></i><i @click="checkIcon('el-icon-s-open')" class='el-icon-s-open'></i><i @click="checkIcon('el-icon-s-shop')" class='el-icon-s-shop'></i><i @click="checkIcon('el-icon-s-help')" class='el-icon-s-help'></i><i @click="checkIcon('el-icon-s-goods')" class='el-icon-s-goods'></i><i @click="checkIcon('el-icon-s-marketing')" class='el-icon-s-marketing'></i><i @click="checkIcon('el-icon-s-flag')" class='el-icon-s-flag'></i><i @click="checkIcon('el-icon-s-comment')" class='el-icon-s-comment'></i><i @click="checkIcon('el-icon-s-finance')" class='el-icon-s-finance'></i><i @click="checkIcon('el-icon-s-claim')" class='el-icon-s-claim'></i><i @click="checkIcon('el-icon-s-tools')" class='el-icon-s-tools'></i><i @click="checkIcon('el-icon-s-custom')" class='el-icon-s-custom'></i><i @click="checkIcon('el-icon-s-opportunity')" class='el-icon-s-opportunity'></i><i @click="checkIcon('el-icon-s-fold')" class='el-icon-s-fold'></i><i @click="checkIcon('el-icon-s-data')" class='el-icon-s-data'></i><i @click="checkIcon('el-icon-s-check')" class='el-icon-s-check'></i><i @click="checkIcon('el-icon-s-grid')" class='el-icon-s-grid'></i><i @click="checkIcon('el-icon-user-solid')" class='el-icon-user-solid'></i><i @click="checkIcon('el-icon-question')" class='el-icon-question'></i><i @click="checkIcon('el-icon-warning')" class='el-icon-warning'></i><i @click="checkIcon('el-icon-remove')" class='el-icon-remove'></i><i @click="checkIcon('el-icon-info')" class='el-icon-info'></i><i @click="checkIcon('el-icon-circle-plus')" class='el-icon-circle-plus'></i><i @click="checkIcon('el-icon-picture')" class='el-icon-picture'></i><i @click="checkIcon('el-icon-location')" class='el-icon-location'></i><i @click="checkIcon('el-icon-error')" class='el-icon-error'></i><i @click="checkIcon('el-icon-success')" class='el-icon-success'></i><i @click="checkIcon('el-icon-camera-solid')" class='el-icon-camera-solid'></i><i @click="checkIcon('el-icon-d-caret')" class='el-icon-d-caret'></i><i @click="checkIcon('el-icon-message-solid')" class='el-icon-message-solid'></i><i @click="checkIcon('el-icon-menu')" class='el-icon-menu'></i><i @click="checkIcon('el-icon-star-on')" class='el-icon-star-on'></i><i @click="checkIcon('el-icon-video-camera-solid')" class='el-icon-video-camera-solid'></i><i @click="checkIcon('el-icon-phone')" class='el-icon-phone'></i><i @click="checkIcon('el-icon-more')" class='el-icon-more'></i><i @click="checkIcon('el-icon-share')" class='el-icon-share'></i><i @click="checkIcon('el-icon-caret-left')" class='el-icon-caret-left'></i><i @click="checkIcon('el-icon-caret-right')" class='el-icon-caret-right'></i><i @click="checkIcon('el-icon-caret-bottom')" class='el-icon-caret-bottom'></i><i @click="checkIcon('el-icon-caret-top')" class='el-icon-caret-top'></i><i @click="checkIcon('el-icon-date')" class='el-icon-date'></i><i @click="checkIcon('el-icon-circle-close')" class='el-icon-circle-close'></i><i @click="checkIcon('el-icon-edit')" class='el-icon-edit'></i><i @click="checkIcon('el-icon-folder')" class='el-icon-folder'></i><i @click="checkIcon('el-icon-folder-opened')" class='el-icon-folder-opened'></i><i @click="checkIcon('el-icon-folder-add')" class='el-icon-folder-add'></i><i @click="checkIcon('el-icon-folder-remove')" class='el-icon-folder-remove'></i><i @click="checkIcon('el-icon-folder-delete')" class='el-icon-folder-delete'></i><i @click="checkIcon('el-icon-folder-checked')" class='el-icon-folder-checked'></i><i @click="checkIcon('el-icon-tickets')" class='el-icon-tickets'></i><i @click="checkIcon('el-icon-document-remove')" class='el-icon-document-remove'></i><i @click="checkIcon('el-icon-document-delete')" class='el-icon-document-delete'></i><i @click="checkIcon('el-icon-document-copy')" class='el-icon-document-copy'></i><i @click="checkIcon('el-icon-document-checked')" class='el-icon-document-checked'></i><i @click="checkIcon('el-icon-document')" class='el-icon-document'></i><i @click="checkIcon('el-icon-document-add')" class='el-icon-document-add'></i><i @click="checkIcon('el-icon-printer')" class='el-icon-printer'></i><i @click="checkIcon('el-icon-paperclip')" class='el-icon-paperclip'></i><i @click="checkIcon('el-icon-download')" class='el-icon-download'></i><i @click="checkIcon('el-icon-upload2')" class='el-icon-upload2'></i><i @click="checkIcon('el-icon-takeaway-box')" class='el-icon-takeaway-box'></i><i @click="checkIcon('el-icon-camera')" class='el-icon-camera'></i><i @click="checkIcon('el-icon-search')" class='el-icon-search'></i><i @click="checkIcon('el-icon-zoom-in')" class='el-icon-zoom-in'></i><i @click="checkIcon('el-icon-zoom-out')" class='el-icon-zoom-out'></i><i @click="checkIcon('el-icon-monitor')" class='el-icon-monitor'></i><i @click="checkIcon('el-icon-attract')" class='el-icon-attract'></i><i @click="checkIcon('el-icon-mobile')" class='el-icon-mobile'></i><i @click="checkIcon('el-icon-video-camera')" class='el-icon-video-camera'></i><i @click="checkIcon('el-icon-scissors')" class='el-icon-scissors'></i><i @click="checkIcon('el-icon-umbrella')" class='el-icon-umbrella'></i><i @click="checkIcon('el-icon-headset')" class='el-icon-headset'></i><i @click="checkIcon('el-icon-brush')" class='el-icon-brush'></i><i @click="checkIcon('el-icon-data-line')" class='el-icon-data-line'></i><i @click="checkIcon('el-icon-mouse')" class='el-icon-mouse'></i><i @click="checkIcon('el-icon-coordinate')" class='el-icon-coordinate'></i><i @click="checkIcon('el-icon-magic-stick')" class='el-icon-magic-stick'></i><i @click="checkIcon('el-icon-reading')" class='el-icon-reading'></i><i @click="checkIcon('el-icon-data-board')" class='el-icon-data-board'></i><i @click="checkIcon('el-icon-pie-chart')" class='el-icon-pie-chart'></i><i @click="checkIcon('el-icon-data-analysis')" class='el-icon-data-analysis'></i><i @click="checkIcon('el-icon-collection-tag')" class='el-icon-collection-tag'></i><i @click="checkIcon('el-icon-edit-outline')" class='el-icon-edit-outline'></i><i @click="checkIcon('el-icon-film')" class='el-icon-film'></i><i @click="checkIcon('el-icon-suitcase')" class='el-icon-suitcase'></i><i @click="checkIcon('el-icon-suitcase-1')" class='el-icon-suitcase-1'></i><i @click="checkIcon('el-icon-picture-outline-round')" class='el-icon-picture-outline-round'></i><i @click="checkIcon('el-icon-picture-outline')" class='el-icon-picture-outline'></i><i @click="checkIcon('el-icon-receiving')" class='el-icon-receiving'></i><i @click="checkIcon('el-icon-collection')" class='el-icon-collection'></i><i @click="checkIcon('el-icon-files')" class='el-icon-files'></i><i @click="checkIcon('el-icon-notebook-1')" class='el-icon-notebook-1'></i><i @click="checkIcon('el-icon-notebook-2')" class='el-icon-notebook-2'></i><i @click="checkIcon('el-icon-toilet-paper')" class='el-icon-toilet-paper'></i><i @click="checkIcon('el-icon-office-building')" class='el-icon-office-building'></i><i @click="checkIcon('el-icon-school')" class='el-icon-school'></i><i @click="checkIcon('el-icon-table-lamp')" class='el-icon-table-lamp'></i><i @click="checkIcon('el-icon-house')" class='el-icon-house'></i><i @click="checkIcon('el-icon-no-smoking')" class='el-icon-no-smoking'></i><i @click="checkIcon('el-icon-smoking')" class='el-icon-smoking'></i><i @click="checkIcon('el-icon-shopping-cart-full')" class='el-icon-shopping-cart-full'></i><i @click="checkIcon('el-icon-shopping-cart-1')" class='el-icon-shopping-cart-1'></i><i @click="checkIcon('el-icon-shopping-cart-2')" class='el-icon-shopping-cart-2'></i><i @click="checkIcon('el-icon-shopping-bag-1')" class='el-icon-shopping-bag-1'></i><i @click="checkIcon('el-icon-shopping-bag-2')" class='el-icon-shopping-bag-2'></i><i @click="checkIcon('el-icon-present')" class='el-icon-present'></i><i @click="checkIcon('el-icon-box')" class='el-icon-box'></i><i @click="checkIcon('el-icon-bank-card')" class='el-icon-bank-card'></i><i @click="checkIcon('el-icon-money')" class='el-icon-money'></i><i @click="checkIcon('el-icon-coin')" class='el-icon-coin'></i><i @click="checkIcon('el-icon-wallet')" class='el-icon-wallet'></i><i @click="checkIcon('el-icon-discount')" class='el-icon-discount'></i><i @click="checkIcon('el-icon-price-tag')" class='el-icon-price-tag'></i><i @click="checkIcon('el-icon-bicycle')" class='el-icon-bicycle'></i><i @click="checkIcon('el-icon-truck')" class='el-icon-truck'></i><i @click="checkIcon('el-icon-ship')" class='el-icon-ship'></i><i @click="checkIcon('el-icon-news')" class='el-icon-news'></i><i @click="checkIcon('el-icon-help')" class='el-icon-help'></i><i @click="checkIcon('el-icon-guide')" class='el-icon-guide'></i><i @click="checkIcon('el-icon-male')" class='el-icon-male'></i><i @click="checkIcon('el-icon-female')" class='el-icon-female'></i><i @click="checkIcon('el-icon-thumb')" class='el-icon-thumb'></i><i @click="checkIcon('el-icon-cpu')" class='el-icon-cpu'></i><i @click="checkIcon('el-icon-link')" class='el-icon-link'></i><i @click="checkIcon('el-icon-connection')" class='el-icon-connection'></i><i @click="checkIcon('el-icon-open')" class='el-icon-open'></i><i @click="checkIcon('el-icon-turn-off')" class='el-icon-turn-off'></i><i @click="checkIcon('el-icon-set-up')" class='el-icon-set-up'></i><i @click="checkIcon('el-icon-chat-round')" class='el-icon-chat-round'></i><i @click="checkIcon('el-icon-chat-line-round')" class='el-icon-chat-line-round'></i><i @click="checkIcon('el-icon-chat-square')" class='el-icon-chat-square'></i><i @click="checkIcon('el-icon-chat-dot-round')" class='el-icon-chat-dot-round'></i><i @click="checkIcon('el-icon-chat-dot-square')" class='el-icon-chat-dot-square'></i><i @click="checkIcon('el-icon-chat-line-square')" class='el-icon-chat-line-square'></i><i @click="checkIcon('el-icon-message')" class='el-icon-message'></i><i @click="checkIcon('el-icon-postcard')" class='el-icon-postcard'></i><i @click="checkIcon('el-icon-position')" class='el-icon-position'></i><i @click="checkIcon('el-icon-turn-off-microphone')" class='el-icon-turn-off-microphone'></i><i @click="checkIcon('el-icon-microphone')" class='el-icon-microphone'></i><i @click="checkIcon('el-icon-close-notification')" class='el-icon-close-notification'></i><i @click="checkIcon('el-icon-bell')" class='el-icon-bell'></i><i @click="checkIcon('el-icon-bangzhu')" class='el-icon-bangzhu'></i><i @click="checkIcon('el-icon-circle-plus-outline')" class='el-icon-circle-plus-outline'></i><i @click="checkIcon('el-icon-remove-outline')" class='el-icon-remove-outline'></i><i @click="checkIcon('el-icon-circle-check')" class='el-icon-circle-check'></i><i @click="checkIcon('el-icon-time')" class='el-icon-time'></i><i @click="checkIcon('el-icon-odometer')" class='el-icon-odometer'></i><i @click="checkIcon('el-icon-crop')" class='el-icon-crop'></i><i @click="checkIcon('el-icon-aim')" class='el-icon-aim'></i><i @click="checkIcon('el-icon-switch-button')" class='el-icon-switch-button'></i><i @click="checkIcon('el-icon-full-screen')" class='el-icon-full-screen'></i><i @click="checkIcon('el-icon-copy-document')" class='el-icon-copy-document'></i><i @click="checkIcon('el-icon-star-off')" class='el-icon-star-off'></i><i @click="checkIcon('el-icon-basketball')" class='el-icon-basketball'></i><i @click="checkIcon('el-icon-football')" class='el-icon-football'></i><i @click="checkIcon('el-icon-soccer')" class='el-icon-soccer'></i><i @click="checkIcon('el-icon-baseball')" class='el-icon-baseball'></i><i @click="checkIcon('el-icon-mic')" class='el-icon-mic'></i><i @click="checkIcon('el-icon-stopwatch')" class='el-icon-stopwatch'></i><i @click="checkIcon('el-icon-medal-1')" class='el-icon-medal-1'></i><i @click="checkIcon('el-icon-medal')" class='el-icon-medal'></i><i @click="checkIcon('el-icon-trophy')" class='el-icon-trophy'></i><i @click="checkIcon('el-icon-trophy-1')" class='el-icon-trophy-1'></i><i @click="checkIcon('el-icon-first-aid-kit')" class='el-icon-first-aid-kit'></i><i @click="checkIcon('el-icon-discover')" class='el-icon-discover'></i><i @click="checkIcon('el-icon-place')" class='el-icon-place'></i><i @click="checkIcon('el-icon-location-outline')" class='el-icon-location-outline'></i><i @click="checkIcon('el-icon-location-information')" class='el-icon-location-information'></i><i @click="checkIcon('el-icon-add-location')" class='el-icon-add-location'></i><i @click="checkIcon('el-icon-delete-location')" class='el-icon-delete-location'></i><i @click="checkIcon('el-icon-map-location')" class='el-icon-map-location'></i><i @click="checkIcon('el-icon-alarm-clock')" class='el-icon-alarm-clock'></i><i @click="checkIcon('el-icon-timer')" class='el-icon-timer'></i><i @click="checkIcon('el-icon-watch-1')" class='el-icon-watch-1'></i><i @click="checkIcon('el-icon-watch')" class='el-icon-watch'></i><i @click="checkIcon('el-icon-wind-power')" class='el-icon-wind-power'></i><i @click="checkIcon('el-icon-light-rain')" class='el-icon-light-rain'></i><i @click="checkIcon('el-icon-lightning')" class='el-icon-lightning'></i><i @click="checkIcon('el-icon-heavy-rain')" class='el-icon-heavy-rain'></i><i @click="checkIcon('el-icon-sunrise')" class='el-icon-sunrise'></i><i @click="checkIcon('el-icon-sunrise-1')" class='el-icon-sunrise-1'></i><i @click="checkIcon('el-icon-sunset')" class='el-icon-sunset'></i><i @click="checkIcon('el-icon-sunny')" class='el-icon-sunny'></i><i @click="checkIcon('el-icon-cloudy')" class='el-icon-cloudy'></i><i @click="checkIcon('el-icon-partly-cloudy')" class='el-icon-partly-cloudy'></i><i @click="checkIcon('el-icon-cloudy-and-sunny')" class='el-icon-cloudy-and-sunny'></i><i @click="checkIcon('el-icon-moon')" class='el-icon-moon'></i><i @click="checkIcon('el-icon-moon-night')" class='el-icon-moon-night'></i><i @click="checkIcon('el-icon-bottom-left')" class='el-icon-bottom-left'></i><i @click="checkIcon('el-icon-bottom-right')" class='el-icon-bottom-right'></i><i @click="checkIcon('el-icon-bottom')" class='el-icon-bottom'></i><i @click="checkIcon('el-icon-back')" class='el-icon-back'></i><i @click="checkIcon('el-icon-right')" class='el-icon-right'></i><i @click="checkIcon('el-icon-top-left')" class='el-icon-top-left'></i><i @click="checkIcon('el-icon-top-right')" class='el-icon-top-right'></i><i @click="checkIcon('el-icon-top')" class='el-icon-top'></i><i @click="checkIcon('el-icon-lock')" class='el-icon-lock'></i><i @click="checkIcon('el-icon-unlock')" class='el-icon-unlock'></i><i @click="checkIcon('el-icon-user')" class='el-icon-user'></i><i @click="checkIcon('el-icon-key')" class='el-icon-key'></i><i @click="checkIcon('el-icon-arrow-up')" class='el-icon-arrow-up'></i><i @click="checkIcon('el-icon-arrow-right')" class='el-icon-arrow-right'></i><i @click="checkIcon('el-icon-arrow-down')" class='el-icon-arrow-down'></i><i @click="checkIcon('el-icon-arrow-left')" class='el-icon-arrow-left'></i><i @click="checkIcon('el-icon-d-arrow-left')" class='el-icon-d-arrow-left'></i><i @click="checkIcon('el-icon-d-arrow-right')" class='el-icon-d-arrow-right'></i><i @click="checkIcon('el-icon-close')" class='el-icon-close'></i><i @click="checkIcon('el-icon-check')" class='el-icon-check'></i><i @click="checkIcon('el-icon-plus')" class='el-icon-plus'></i><i @click="checkIcon('el-icon-minus')" class='el-icon-minus'></i><i @click="checkIcon('el-icon-delete')" class='el-icon-delete'></i><i @click="checkIcon('el-icon-sold-out')" class='el-icon-sold-out'></i><i @click="checkIcon('el-icon-sell')" class='el-icon-sell'></i><i @click="checkIcon('el-icon-service')" class='el-icon-service'></i><i @click="checkIcon('el-icon-mobile-phone')" class='el-icon-mobile-phone'></i><i @click="checkIcon('el-icon-sort')" class='el-icon-sort'></i><i @click="checkIcon('el-icon-rank')" class='el-icon-rank'></i><i @click="checkIcon('el-icon-refresh')" class='el-icon-refresh'></i><i @click="checkIcon('el-icon-loading')" class='el-icon-loading'></i><i @click="checkIcon('el-icon-view')" class='el-icon-view'></i><i @click="checkIcon('el-icon-finished')" class='el-icon-finished'></i><i @click="checkIcon('el-icon-more-outline')" class='el-icon-more-outline'></i><i @click="checkIcon('el-icon-phone-outline')" class='el-icon-phone-outline'></i><i @click="checkIcon('el-icon-setting')" class='el-icon-setting'></i><i @click="checkIcon('el-icon-warning-outline')" class='el-icon-warning-outline'></i><i @click="checkIcon('el-icon-refresh-right')" class='el-icon-refresh-right'></i><i @click="checkIcon('el-icon-refresh-left')" class='el-icon-refresh-left'></i><i @click="checkIcon('el-icon-dish')" class='el-icon-dish'></i><i @click="checkIcon('el-icon-dish-1')" class='el-icon-dish-1'></i><i @click="checkIcon('el-icon-food')" class='el-icon-food'></i><i @click="checkIcon('el-icon-chicken')" class='el-icon-chicken'></i><i @click="checkIcon('el-icon-fork-spoon')" class='el-icon-fork-spoon'></i><i @click="checkIcon('el-icon-knife-fork')" class='el-icon-knife-fork'></i><i @click="checkIcon('el-icon-burger')" class='el-icon-burger'></i><i @click="checkIcon('el-icon-tableware')" class='el-icon-tableware'></i><i @click="checkIcon('el-icon-sugar')" class='el-icon-sugar'></i><i @click="checkIcon('el-icon-dessert')" class='el-icon-dessert'></i><i @click="checkIcon('el-icon-ice-cream')" class='el-icon-ice-cream'></i><i @click="checkIcon('el-icon-hot-water')" class='el-icon-hot-water'></i><i @click="checkIcon('el-icon-water-cup')" class='el-icon-water-cup'></i><i @click="checkIcon('el-icon-coffee-cup')" class='el-icon-coffee-cup'></i><i @click="checkIcon('el-icon-cold-drink')" class='el-icon-cold-drink'></i><i @click="checkIcon('el-icon-goblet')" class='el-icon-goblet'></i><i @click="checkIcon('el-icon-goblet-full')" class='el-icon-goblet-full'></i><i @click="checkIcon('el-icon-goblet-square')" class='el-icon-goblet-square'></i><i @click="checkIcon('el-icon-goblet-square-full')" class='el-icon-goblet-square-full'></i><i @click="checkIcon('el-icon-refrigerator')" class='el-icon-refrigerator'></i><i @click="checkIcon('el-icon-grape')" class='el-icon-grape'></i><i @click="checkIcon('el-icon-watermelon')" class='el-icon-watermelon'></i><i @click="checkIcon('el-icon-cherry')" class='el-icon-cherry'></i><i @click="checkIcon('el-icon-apple')" class='el-icon-apple'></i><i @click="checkIcon('el-icon-pear')" class='el-icon-pear'></i><i @click="checkIcon('el-icon-orange')" class='el-icon-orange'></i><i @click="checkIcon('el-icon-coffee')" class='el-icon-coffee'></i><i @click="checkIcon('el-icon-ice-tea')" class='el-icon-ice-tea'></i><i @click="checkIcon('el-icon-ice-drink')" class='el-icon-ice-drink'></i><i @click="checkIcon('el-icon-milk-tea')" class='el-icon-milk-tea'></i><i @click="checkIcon('el-icon-potato-strips')" class='el-icon-potato-strips'></i><i @click="checkIcon('el-icon-lollipop')" class='el-icon-lollipop'></i><i @click="checkIcon('el-icon-ice-cream-square')" class='el-icon-ice-cream-square'></i><i @click="checkIcon('el-icon-ice-cream-round')" class='el-icon-ice-cream-round'></i>
            </div>
          </template>
        </el-dialog>
        <el-row>
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
            <el-col :span="12"><div class="grid-content bg-purple"  style="width: 300px; ">
              <el-form-item :label="$t('菜单名称')" prop="name">
                <el-input style="width: 200px;" v-model="temp.name"  placeholder="请输入内容" />
              </el-form-item>
              <el-form-item :label="$t('URI')" prop="path">
                <el-input style="width: 200px;" v-model="temp.path"  placeholder="请输入内容" />
              </el-form-item>
              <el-form-item :label="$t('菜单类型')" prop="menu_type">
                <el-select style="width: 200px;" v-bind:disabled="disabledSelect" v-model="temp.level" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in menuTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('状态')" prop="is_show">
                <el-select style="width: 200px;" v-bind:disabled="disabledSelect2"  v-model="temp.status" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
              </el-form-item>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light"  style="width: 300px; ">
              <el-form-item :label="$t('权限标识')" prop="permission_name">
                <el-input style="width: 200px;"  v-bind:disabled="disabledInput" v-model="temp.permission_name"  placeholder="创建之后不可修改" />
              </el-form-item>
              <el-form-item  :label="$t('图标')" prop="icon">
                <i style="font-size: 26px;" v-bind:class="temp.icon" ></i>
                <el-button @click="innerVisible = true">{{ $t('选择图标') }}</el-button>
              </el-form-item>
              <el-form-item :label="$t('模块类型')" prop="guard_name">
                <el-select style="width: 200px;"  v-model="temp.guard_name" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in modelTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input style="width: 200px;"  v-model="temp.sort" />
              </el-form-item>
            </div></el-col>
          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="dialogStatus==='createf' || dialogStatus==='creates' || dialogStatus==='createz'  ?createData():updateData()">{{ $t('确定') }}</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
  import "@/libs/zTree/js/jquery-1.4.4.min.js";
  import "@/libs/zTree/js/jquery.ztree.core.min.js";
  import "@/libs/zTree/js/jquery.ztree.excheck.min.js";
  import "@/libs/zTree/css/zTreeStyle/zTreeStyle.css";
  import { fetchList, createMenu, updateMenu, deleteMenu } from '@/api/admin/node'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Sticky from '@/components/Sticky'
  const statusMap = {
    1: '显示',
    2: '隐藏'
  };
  const colorMap = {
    1: 'success',
    2: 'info'
  };
  const typeMap = {
    1: '顶级菜单',
    2: '子级菜单',
    3: '功能节点',
  };
  const guardMap = {
    'admin':'后台系统'
  };
  export default {
    name: 'Menu',
    components: { Pagination,Sticky},
    directives: { waves },
    filters: {
      statusFilter(status) {
        return statusMap[status]
      },
      colorFilter(status) {
        return colorMap[status]
      },
      typeFilter(type) {
        return typeMap[type]
      },
      guardFilter(guard){
        return guardMap[guard]
      }

    },
    data(){
      return {
        tableKey: 0,
        list: null,
        allList:null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          export: undefined,
          title: undefined,
          pid: undefined,
          sort: '+id',
          name : undefined
        },
        textMap: {
          update: '编辑菜单节点',
          createf:'创建父级菜单',
          creates:'创建子菜单',
          createz:'创建功能节点'
        },
        rules: {
          name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
          permission_name: [{ required: true, message: '菜单标识不能为空', trigger: 'blur' }],
          path: [{ required: true, message: '路由不能为空', trigger: 'blur' }],
        },
        innerVisible:false,
        statusOptions: [{ label: '显示', key: 1 }, { label: '隐藏', key: 2 }],
        menuTypeOptions: [{ label: '父级菜单', key: 1 }, { label: '子菜单', key: 2 },{label : '功能节点',key:3}],
        modelTypeOptions: [{ label: '后台管理', key: 'admin' }],
        dialogFormVisible:false,
        dialogStatus: '',
        downloadLoading: false,
        disabledSelect:true,
        disabledInput:false,
        disabledSelect2:false,
        temp: {
          id: undefined,
          sort: 1,
          icon:'',
          name: '',
          level: 1,
          guard_name: '',
          path: '',
          permission_name :'',
          pid:undefined,
          status:undefined,
        },
        restaurants: [],
        zNodes:[],
        input: '',
        treeObj:{},
        setting:{
          data: {
            key: {
              name:'name',
            },
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: this.onClick
          }
        },
      }
    },
    watch: {
      dialogFormVisible : function(val, oldVal) {
        if(!val) {
          this.listQuery = {
              page: 1,
              limit: 10,
              export: undefined,
              title: undefined,
              pid: undefined,
              sort: '+id',
              name : undefined
          }
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      onClick(event, treeId, treeNode){
        this.listQuery.pid = treeNode.id;
        this.listQuery.sort = '+id';
        this.handleFilter();
      },
      ztreeInit(){
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      },
      expandAll(){
        this.treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        this.treeObj.expandAll(true);
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.zNodes = response.data.tree;
          if(!(this.listQuery.pid > 0)){
            this.ztreeInit();
            this.expandAll();
          }
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data;
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          sort: 1,
          icon:'',
          name: '',
          level: 1,
          guard_name: 'admin',
          path: '',
          permission_name :'',
          pid:undefined,
          status:1
        }
      },
      resetDisable(){
        this.disabledInput = false;
        this.disabledSelect2 = false;
      },
      handleCreate(a,b) {
        this.resetTemp();
        this.resetDisable();
        this.dialogStatus = b;
        this.dialogFormVisible = true;
        if(b === 'creates'){
          this.temp.level = 2;
        }else if(b === 'createz'){
          this.temp.level = 3;
          this.temp.status = 2;
          this.disabledSelect2 = true;
        }
        this.temp.pid = a;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createMenu(this.temp).then( () => {
              this.getList()
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update';
        this.disabledInput = false;
        this.disabledSelect2 = false;
        this.dialogFormVisible = true;
        if( this.temp.menu_type === 3) {
          this.disabledSelect2 = true;
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = {
                id: this.temp.id,
                pid: this.temp.pid,
                sort: this.temp.sort,
                icon: this.temp.icon,
                name: this.temp.name,
                path: this.temp.path,
                status: this.temp.status,
                level : this.temp.level,
               permission_name : this.temp.permission_name,
            }
            updateMenu(tempData).then(() => {
              this.getList()
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
            })
          }
        })
      },
      handleDelete(row) {
        let msg = '';
        if(row.menu_type === 3){
          msg='此操作将删除该节点, 是否继续?'
        }else if (row.menu_type === 2){
          msg='此操作将删除该子菜单已经下面的功能节点, 是否继续?';
        }else {
          msg ='此操作将删除该顶级菜单以及下面的子菜单和功能节点, 是否继续?';
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(row.id,row.level).then(() => {
            this.$notify({
              title: '成功',
              message: '删除',
              type: 'success',
              duration: 2000
            });
            this.getList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        this.listQuery.export = 1;
        fetchList(this.listQuery).then(response => {
          this.allList = response.data.items;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['ID', '图标', '菜单名称', '权限标识', '路由地址','菜单类型','当前状态','模块类型','排序']
            const filterVal = ['id', 'icon', 'name', 'permission_name', 'path','level','status','guard_name','sort']
            const data = this.formatJson(filterVal, this.allList);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '菜单节点列表'
            });
            this.downloadLoading = false
          });
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'level') {
            return typeMap[v[j]]
          }else if(j === 'status'){
            return statusMap[v[j]]
          }else if(j === 'guard_name'){
            return guardMap[v[j]]
          } else {
            return v[j]
          }
        }))
      },
      checkIcon(icon_name){
        this.temp.icon = icon_name;
        this.innerVisible = false;
      }
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .card-header{
    height: 49px;
    text-indent: 20px;
    line-height: 52px;
    font-size: 14px;
  }
  .components-container div {
    margin: 10px;
  }
  .pagination-container {
    padding: 0px;
  }

  .time-container {
    display: inline-block;
  }
  .icon i { font-size: 26px;cursor:pointer}
</style>
