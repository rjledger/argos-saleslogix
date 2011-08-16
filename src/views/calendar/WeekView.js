/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.SalesLogix.Calendar");

(function() {
    Mobile.SalesLogix.Calendar.WeekView = Ext.extend(Sage.Platform.Mobile.GroupedList, {
        //Localization
        titleText: 'Calendar',
        weekTitleFormatText: 'MMM d, yyyy',
        dayHeaderLeftFormatText: 'ddd',
        dayHeaderRightFormatText: 'MMM d, yyyy',
        startTimeFormatText: 'h:mm',
        todayText: 'Today',
        dayText: 'Day',
        weekText: 'Week',
        monthText: 'Month',
        allDayText: 'All Day',

        // Templates
        viewTemplate: new Simplate([
            '<div id="{%= $.id %}" title="{%= $.titleText %}" class="{%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
            '{%! $.searchTemplate %}',
            '{%! $.navigationTemplate %}',
            '<a href="#" class="android-6059-fix">fix for android issue #6059</a>',                
            '<div class="list-content panel-content"></div>',
            '{%! $.moreTemplate %}',
            '</div>'
        ]),
        navigationTemplate: new Simplate([
            '<div class="split-buttons">',
            '<button data-tool="today" data-action="getThisWeekActivities" class="button">{%: $.todayText %}</button>',
            '<button data-tool="day" data-action="navigateToUserActivityList" class="button">{%: $.dayText %}</button>',
            '<button data-tool="week" data-action="getWeekActivities" class="button">{%: $.weekText %}</button>',
            '<button data-tool="month" data-action="navigateToMonthView" class="button">{%: $.monthText %}</button>',
            '</div>',
            '<div class="nav-bar">',
            '<h3 class="date-text"></h3>',
            '<button data-tool="next" data-action="getNextWeekActivities" class="button button-next"><span></span></button>',
            '<button data-tool="prev" data-action="getPrevWeekActivities" class="button button-prev"><span></span></button>',
            '</div>'
        ]),
        groupTemplate: new Simplate([
            '<h2 data-action="toggleGroup" class="{%= $.headerClass %}" data-date="{%= $.currentDate %}">',
            '<span class="dayHeaderLeft">{%= $.currentDateLeftHeader %}</span>',
            '<span class="dayHeaderRight">{%= $.currentDateRightHeader %}</span>',
            '</h2>',
            '<ul data-group="{%= $.tag %}" class="list-content {%= $.cls %}"></ul>'
        ]),
        itemTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.$key %}" data-descriptor="{%: $.$descriptor %}" data-activity-type="{%: $.Activity.Type %}">',
            '{%! $$.contentTemplate %}',
            '</li>'
        ]),
        contentTemplate: new Simplate([
            '<div class="activityRow">'+
            '<img src="{%= $$.getTypeIcon($.Activity.Type) %}">'+
            '{% if ($.Activity.Timeless) { %}'+
                '<span class="activityTime">{%= $$.allDayText %}</span>'+
            '{% } else { %}'+
                '<span class="activityTime">{%: Mobile.SalesLogix.Format.date($.Activity.StartDate, $$.startTimeFormatText) %}'+
                '<span class="activityAMPM">{%: Mobile.SalesLogix.Format.date($.Activity.StartDate, "tt") %}</span></span>'+
            '{% } %}'+
            '{%! $$.descriptionTemplate %}'+
            '</div>'+
            '<div class="clear"></div>'
        ]),
        descriptionTemplate: new Simplate([
            '{% if ($.Activity.Description !== null && $$.nameTemplate.apply($).length > 1) { %}',
                '<h3>{%: $.Activity.Description %}</h3>',
                '<h4>{%= $$.nameTemplate.apply($) %}</h4>',
            '{% } else { %}',
                '{% if ($.Activity.Description !== null) { %}',
                    '<h3 class="singleDescription">{%: $.Activity.Description %}</h3>',
                '{% } else { %}',
                    '<h4 class="singleDescription">{%= $$.nameTemplate.apply($) %}</h4>',
                '{% } %}',
            '{% } %}'
        ]),
        nameTemplate: new Simplate([
            '{% if ($.Activity.ContactName) { %}',
                '{%: $.Activity.ContactName %} / {%: $.Activity.AccountName %}',
            '{% } else if ($.Activity.AccountName) { %}',
                '{%: $.Activity.AccountName %}',
            '{% } else { %}',
                '{%: $.Activity.LeadName %}',
            '{% } %}'
        ]),
        dayHeaderTemplate: new Simplate([
            '<h2 class="{%= $.headerClass %}" data-action="activateDayHeader" data-date="{%= $.currentDate %}">'+
            '<span class="dayHeaderLeft">{%= $.currentDateLeftHeader %}</span>',
            '<span class="dayHeaderRight">{%= $.currentDateRightHeader %}</span>',
            '</h2>'
        ]),

        //View Properties
        attachmentPoints: Ext.apply({}, {
            contentEl: '.list-content',
            dateTextEl: '.date-text'
        }, Sage.Platform.Mobile.List.prototype.attachmentPoints),
        id: 'calendar_weeklist',
        cls: 'list activities-for-week',
        detailView: 'activity_detail',
        monthView: 'slx_calendar',
        activityListView: 'useractivity_list',
        insertView: 'activity_types_list',
        userWeekStartDay: 0, // 0-6, Sun-Sat
        userWeekEndDay: 6,
        currentDate: null,
        hideSearch: true,
        refreshRequired: true,
        weekStartDate: null,
        weekEndDate: null,
        todayDate: null,
        use24Time: false,
        activeDateClass: 'currentDate',
        typeIcons: {
            'defaultIcon': 'content/images/icons/To_Do_24x24.png',
            'atAppointment': 'content/images/icons/Meeting_24x24.png',
            'atPhoneCall': 'content/images/icons/Call_24x24.png',
            'atToDo': 'content/images/icons/To_Do_24x24.png',
            'atPersonal': 'content/images/icons/Personal_24x24.png',
            'atLiterature': 'content/images/icons/letters_24.png'
        },

        queryWhere: null,
        queryOrderBy: 'Activity.StartDate asc',
        querySelect: [
            'Activity/Description',
            'Activity/StartDate',
            'Activity/Type',
            'Activity/AccountName',
            'Activity/ContactName',
            'Activity/LeadId',
            'Activity/LeadName',
            'Activity/UserId',
            'Activity/Timeless'
        ],
        pageSize: 105, // gives 15 activities per day
        resourceKind: 'useractivities',

        init: function() {
            Mobile.SalesLogix.Calendar.WeekView.superclass.init.apply(this, arguments);
            this.todayDate = new Date().clearTime();
            this.currentDate = this.todayDate.clone();
            this.setWeekQuery(this.todayDate);
        },
        initEvents: function() {
            Mobile.SalesLogix.Calendar.WeekView.superclass.initEvents.apply(this, arguments);
            this.el.on('swipe', this.onSwipe, this);
        },
        onSwipe: function(evt, el){
            switch(evt.browserEvent.direction){
                case 'right':
                    this.onSwipeRight();
                    evt.preventDefault(); // todo: is this needed?
                    break;
                case 'left':
                    this.onSwipeLeft();
                    evt.preventDefault(); // todo: is this needed?
                    break;
            }
        },
        onSwipeRight: function(){
            this.getNextWeekActivities();
        },
        onSwipeLeft: function(){
            this.getPrevWeekActivities();
        },
        activateDayHeader: function(params){
            this.currentDate = Date.parse(params.date);
            this.navigateToUserActivityList();
        },
        getThisWeekActivities: function(){
            if(!this.isInCurrentWeek(this.todayDate)){
                this.refresh(this.todayDate);
            }
        },
        getStartDay: function(date){
            return (date.getDay()===this.userWeekStartDay)
                    ? date.clone()
                    : date.clone().moveToDayOfWeek(this.userWeekStartDay, -1);
        },
        getEndDay: function(date){
            return (date.getDay()===this.userWeekEndDay)
                    ? date.clone()
                    : date.clone().moveToDayOfWeek(this.userWeekEndDay, 1);
        },
        getNextWeekActivities: function(){
            var nextStartDay = this.getStartDay(this.weekEndDate.clone().addDays(1));
            this.refresh(nextStartDay);
        },
        getPrevWeekActivities: function(){
            var prevStartDay = this.getStartDay(this.weekStartDate.clone().addDays(-1));
            this.refresh(prevStartDay);
        },
        getTypeIcon: function(type){
            return this.typeIcons[type] || this.typeIcons['defaultIcon'];
        },
        setWeekQuery: function(date){
            var setDate = date || this.currentDate || new Date(),
                weekQuery,
                userId = App.context['user'] && App.context['user']['$key'];

            this.weekStartDate = this.getStartDay(setDate);
            this.weekEndDate = this.getEndDay(setDate);

            weekQuery = 'UserId eq "'+userId+'" and '+
                '(Activity.StartDate gt '+
                this.weekStartDate.toString('@yyyy-MM-ddT00:00:00@')+
                ' and Activity.StartDate lt '+
                this.weekEndDate.toString('@yyyy-MM-ddT23:59:59@')+
                ')';

            this.queryWhere =  weekQuery;
        },
        setWeekTitle: function(){
            var start = this.getStartDay(this.currentDate),
                end = this.getEndDay(this.currentDate);
            this.dateTextEl.update(start.toString(this.weekTitleFormatText)+'-'+
                end.toString(this.weekTitleFormatText)
            );
        },
        setWeekStartDay: function(){
            var startDay = (this.options !== undefined && this.options['startDay'] !== undefined)
                ? this.options['startDay']
                : this.userWeekStartDay;
            this.userWeekStartDay = startDay;
            this.userWeekEndDay = this.getStartDay(new Date()).addDays(6).getDay();
        },
        isInCurrentWeek: function(date){
            return date.between(this.weekStartDate, this.weekEndDate);
        },
        toggleGroup: function(params) {
            this.currentDate = Date.parse(params.date);
            this.navigateToUserActivityList();
        },
        getGroupForEntry: function(entry) {
            var entryDate = entry.Activity.StartDate,
                compareFormat = 'yyyy-MM-dd',
                headerClass = (entryDate.toString(compareFormat)===this.todayDate.toString(compareFormat))
                    ? 'dayHeader '+this.activeDateClass
                    : 'dayHeader';
            return {
                'tag': entryDate.toString(compareFormat),
                'currentDateLeftHeader': entryDate.toString(this.dayHeaderLeftFormatText),
                'currentDateRightHeader': entryDate.toString(this.dayHeaderRightFormatText),
                'headerClass': headerClass,
                'currentDate': entryDate.toString(compareFormat),
                'date': entryDate
            };
        },
        processFeed: function(feed) {
            if (!this.feed){ this.contentEl.update(''); }
            this.feed = feed;

            if (this.feed['$totalResults'] === 0)
            {
                Ext.DomHelper.append(this.contentEl, this.noDataTemplate.apply(this));
            }
            else if (feed['$resources'])
            {
                var i,
                    feedLength=feed['$resources'].length,
                    startDate,
                    currentEntry,
                    entryGroup,
                    todayEntry = null,
                    todayAdded = false,
                    o=[];

                for(i=0; i<feedLength; i+=1){
                    currentEntry = feed['$resources'][i].Activity;
                    startDate = Sage.Platform.Mobile.Convert.toDateFromString(currentEntry.StartDate);
                    if(currentEntry.Timeless){
                        startDate = this.addUtcOffset(startDate);
                    }
                    currentEntry.StartDate = startDate;
                }

                feed['$resources'].sort(function(a,b){
                    return a.Activity.StartDate.compareTo(b.Activity.StartDate);
                });

                for (i = 0; i < feedLength; i+=1)
                {
                    currentEntry = feed['$resources'][i];
                    entryGroup = this.getGroupForEntry(currentEntry);

                    if (entryGroup.tag != this.currentGroup.tag || (i===0 && feedLength===1))
                    {
                        if( this.isInCurrentWeek(this.todayDate)
                            && entryGroup.date.clone().clearTime().compareTo(this.todayDate) === 1
                            && (!this.currentGroup ||
                                this.currentGroup.date.clone().clearTime().compareTo(this.todayDate) === -1)){

                            todayEntry = this.getGroupForEntry({
                                'Activity': { 'StartDate': this.todayDate }
                            });
                        }

                        if (o.length > 0){
                            Ext.DomHelper.append(this.currentGroupEl, o.join(''));
                        }
                        o = [];

                        if(todayEntry && !todayAdded){
                            this.currentGroupEl = Ext.DomHelper.append(this.contentEl, this.groupTemplate.apply(todayEntry, this), true);
                            todayAdded = true;
                        }

                        this.currentGroup = entryGroup;
                        this.currentGroupEl = Ext.DomHelper.append(this.contentEl, this.groupTemplate.apply(entryGroup, this), true);
                    }

                    this.entries[currentEntry.$key] = currentEntry;

                    o.push(this.itemTemplate.apply(currentEntry, this));
                }
                
                if(!todayAdded && this.isInCurrentWeek(this.todayDate)){
                    todayEntry = this.getGroupForEntry({
                        'Activity': { 'StartDate': this.todayDate }
                    });
                    Ext.DomHelper.append(this.contentEl, this.groupTemplate.apply(todayEntry, this), true);
                }

                if (o.length > 0)
                    Ext.DomHelper.append(this.currentGroupEl, o.join(''));
            }

            if (this.remainingEl)
                this.remainingEl.update(String.format(
                    this.remainingText,
                    this.feed['$totalResults'] - (this.feed['$startIndex'] + this.feed['$itemsPerPage'] - 1)
                ));

            if (this.hasMoreData())
                this.el.addClass('list-has-more');
            else
                this.el.removeClass('list-has-more');
        },
        addUtcOffset: function(date){
            var utcOffset,
                utcOffsetHours,
                utcOffsetMinutes;
            utcOffset = date.getUTCOffset(); // +0930, -0700
            utcOffsetHours = parseInt(utcOffset.substr(0,3),10) * -1;
            utcOffsetMinutes = parseInt(utcOffset.substr(3,2),10) * ((utcOffsetHours>0) ? 1 : -1);
            date.add({
                    'hours': utcOffsetHours,
                    'minutes': utcOffsetMinutes
            });
            return date;
        },
        _onRefresh: function(o) {
            Mobile.SalesLogix.Calendar.WeekView.superclass._onRefresh.apply(this, arguments);
            if (o.resourceKind === 'activities') this.refreshRequired = true;
        },
        refresh: function(newDate) {
            var startDate = newDate || this.currentDate || new Date();
            this.setWeekStartDay();
            this.currentDate = startDate.clone();
            this.weekStartDate = this.getStartDay(startDate);
            this.weekEndDate = this.getEndDay(startDate);
            this.setWeekTitle();
            this.setWeekQuery();
            this.clear();
            this.requestData();
        },
        show: function(options) {
            this.options = options;
            this.setDefaultOptions();
            Sage.Platform.Mobile.List.superclass.show.apply(this, arguments);
        },
        setDefaultOptions: function(){
            if(this.options===undefined) this.options = {};
            if(this.options['startDay'] === undefined){
                this.options['startDay'] = (App.context.userOptions)
                    ? parseInt(App.context.userOptions['Calendar:FirstDayofWeek'],10)
                    : this.userWeekStartDay;
            }
        },
        navigateToUserActivityList: function() {
            var view = App.getView(this.activityListView);
            view.currentDate = this.currentDate.clone() || new Date();
            view.getActivities();
            view.show({returnTo: this.id});
        },
        navigateToMonthView: function() {
            var view = App.getView(this.activityListView);
            view.currentDate = this.currentDate.clone() || new Date();
            view = App.getView(this.monthView);
            view.show({returnTo: this.id});
       },
        navigateToDetailView: function(key, descriptor) {
            var entry = this.entries[key],
                activity = entry['Activity'],
                description = activity['Description'],
                key = activity['$key'];

            Mobile.SalesLogix.Activity.List.superclass.navigateToDetailView.call(this, key, description);            
        }
    });
})();