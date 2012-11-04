module Jekyll

    class TagPages < Generator
  
        safe true

        def generate(site)
            dir = site.config['tag_dir'] || "/tag"
            site.tags.each do |tag, posts|
                paginate_tag(site, dir, tag, posts, 'tag_index.html', 'tag_page.html')
            end
        
            # site.pages.dup.each do |page|
                # paginate_page(site, page) if page.data['paginate']
            # end
            paginate_tag(site, "/", "articles", site.posts, 'article.html', 'tag_page.html')
        end

        def paginate_tag(site, dir, tag, posts, lindex, lpage)
    
            # sort tag by descending date of publish
            posts = posts.sort_by { |p| -p.date.to_f }

            # calculate total number of pages
            pages = TagPager.calculate_pages(posts, site.config['paginate'].to_i)
            
            # iterate over the total number of pages and create a physical page for each
            (1..pages).each do |num_page|
	  
                # the TagPager handles the paging and tag data
                pager = TagPager.new(site.config, num_page, posts, dir, tag, pages)

                # No pages exist so we generate everything.
                if num_page > 1
                    gen_page(site, dir, tag, lpage, pager, num_page)
                else
                    gen_index(site, dir, tag, lindex, pager)
                end
            end
        end

        def paginate_page(site, page)
            namekey = page.data['namekey']
            includetags = page.data['includetags'].split(",")
            posts = []
            if includetags.include?("all")
                posts = site.posts
            else
                site.tags.each do |tag, ps|
                    includetags.each do |inc|
                        if inc == tag
                            posts = posts.zip(ps).flatten.compact.uniq
                        end
                    end
                end
            end
          
            posts = posts.sort_by { |p| -p.date.to_f }
            pages = TagPager.calculate_pages(posts, site.config['paginate'].to_i)

            (1..pages).each do |num_page|
          
                pager = TagPager.new(site.config, num_page, posts, "/", namekey, pages)

                if num_page > 1
                    gen_page(site, "/", namekey, 'tag_page.html', pager, num_page)
                else
                    page.pager = pager
                end
            end
        end
	
        def gen_page(site, dir, tag, layout, pager, num_page)
            newpage = TagSubPage.new(site, site.source, tag, layout)
            newpage.pager = pager
            newpage.dir = File.join(dir, "/#{tag}/page#{num_page}")
            site.pages << newpage
        end
        
        def gen_index(site, dir, tag, layout, pager)
            newpage = TagSubPage.new(site, site.source, tag, layout)
            newpage.pager = pager
            newpage.dir = File.join(dir, "/#{tag}")
            site.pages << newpage
        end
    end
  
    class TagPager < Pager
        attr_reader :tag
        attr_reader :mDir
    
        # same as the base class, but includes the tag value
        def initialize(config, page, all_posts, dir, tag, num_pages = nil)
            @tag = tag
            @mDir = dir
            super config, page, all_posts, num_pages
        end

        # use the original to_liquid method, but add in tag info
        alias_method :original_to_liquid, :to_liquid
        def to_liquid
            x = original_to_liquid
            x['tag'] = @tag
            x['mdir'] = @mDir
            x
        end
    end
  
  # The TagSubPage class creates a single tag page for the specified tag.
  # This class exists to specify the layout to use for pages after the first index page
    class TagSubPage < Page
        def initialize(site, base, tag, layout)
        
            @site = site
            @base = base
            @dir  = tag
            @name = 'index.html'

            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), layout || 'tag_index.html')
            self.data['title'] = site.config["#{tag}_title"] || "Tag: #{tag}"
            self.data['header'] = site.config["#{tag}_header"] || "Tag: #{tag}"
        end
    end

  
    module Filters
    
        def pager_links(pager)
        
            if pager['previous_page'] || pager['next_page']
                html = '<div class="pager clearfix">'
                m_path = File.join(pager['mdir'], pager['tag'])
                
                if pager['previous_page']
                    if pager['previous_page'] == 1
                        html << "<div class=\"previous\"><a href=\"#{m_path}/\">&laquo; Newer posts</a></div>"
                    else
                        html << "<div class=\"previous\"><a href=\"#{m_path}/page#{pager['previous_page']}\">&laquo; Newer posts</a></div>"
                    end
                end

                if pager['next_page'] 
                    html << "<div class=\"next\"><a href=\"#{m_path}/page#{pager['next_page']}\">Older posts &raquo;</a></div>"
                end

                html << '</div>'
                html
            end
        end
    end
end
