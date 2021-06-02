var documenterSearchIndex = {"docs":
[{"location":"api.html#API-Documentation","page":"API","title":"API Documentation","text":"","category":"section"},{"location":"api.html","page":"API","title":"API","text":"Modules = [ChainRulesOverloadGeneration]\nPages = [\"ruleset_loading.jl\"]\nPrivate = false","category":"page"},{"location":"api.html#ChainRulesOverloadGeneration.on_new_rule-Tuple{Any, Any}","page":"API","title":"ChainRulesOverloadGeneration.on_new_rule","text":"on_new_rule(hook, frule | rrule)\n\nRegister a hook function to run when new rules are defined. The hook receives a signature type-type as input, and generally will use eval to define an overload of an AD system's overloaded type For example, using the signature type Tuple{typeof(+), Real, Real} to make +(::DualNumber, ::DualNumber) call the frule for +. A signature type tuple always has the form: Tuple{typeof(operation), typeof{pos_arg1}, typeof{pos_arg2}...}, where pos_arg1 is the first positional argument.\n\nThe hooks are automatically run on new rules whenever a package is loaded. They can be manually triggered by refresh_rules. When a hook is first registered with on_new_rule it is run on all existing rules.\n\n\n\n\n\n","category":"method"},{"location":"api.html#ChainRulesOverloadGeneration.refresh_rules-Tuple{}","page":"API","title":"ChainRulesOverloadGeneration.refresh_rules","text":"refresh_rules()\nrefresh_rules(frule | rrule)\n\nThis triggers all on_new_rule hooks to run on any newly defined rules. It is automatically run when ever a package is loaded. It can also be manually called to run it directly, for example if a rule was defined in the REPL or within the same file as the AD function.\n\n\n\n\n\n","category":"method"},{"location":"api.html#Internal","page":"API","title":"Internal","text":"","category":"section"},{"location":"api.html","page":"API","title":"API","text":"ChainRulesOverloadGeneration.clear_new_rule_hooks!","category":"page"},{"location":"api.html#ChainRulesOverloadGeneration.clear_new_rule_hooks!","page":"API","title":"ChainRulesOverloadGeneration.clear_new_rule_hooks!","text":"clear_new_rule_hooks!(frule|rrule)\n\nClears all hooks that were registered with corresponding on_new_rule. This is useful for while working interactively to define your rule generating hooks. If you previously wrong an incorrect hook, you can use this to get rid of the old one.\n\nwarning: Warning\nThis absolutely should not be used in a package, as it will break any other AD system using the rule hooks that might happen to be loaded.\n\n\n\n\n\n","category":"function"},{"location":"examples/forward_mode.html#ForwardDiffZero","page":"Forward Mode","title":"ForwardDiffZero","text":"","category":"section"},{"location":"examples/forward_mode.html","page":"Forward Mode","title":"Forward Mode","text":"This is a fairly standard operator overloading-based forward mode AD system. It defines a Dual part which holds both the primal value, paired with the partial derivative. It doesn't handle chunked-mode, or perturbation confusion. The overload generation hook in this example is: define_dual_overload.","category":"page"},{"location":"examples/forward_mode.html","page":"Forward Mode","title":"Forward Mode","text":"using Markdown\nMarkdown.parse(\"\"\"\n```julia\n$(read(joinpath(@__DIR__,\"../../../test/demos/forwarddiffzero.jl\"), String))\n```\n\"\"\")","category":"page"},{"location":"examples/reverse_mode.html#ReverseDiffZero","page":"Reverse Mode","title":"ReverseDiffZero","text":"","category":"section"},{"location":"examples/reverse_mode.html","page":"Reverse Mode","title":"Reverse Mode","text":"This is a fairly standard operator overloading based reverse mode AD system. It defines a Tracked type which carries the primal value as well as a reference to the tape which is it using, a partially accumulated partial derivative and a propagate function that propagates its partial back to its input. A perhaps unusual thing about it is how little it carries around its creating operator's inputs. That information is all entirely wrapped up in the propagate function. The overload generation hook in this example is: define_tracked_overload.","category":"page"},{"location":"examples/reverse_mode.html","page":"Reverse Mode","title":"Reverse Mode","text":"using Markdown\nMarkdown.parse(\"\"\"\n```julia\n$(read(joinpath(@__DIR__,\"../../../test/demos/reversediffzero.jl\"), String))\n```\n\"\"\")","category":"page"},{"location":"index.html#Operator-Overloading-AD-with-ChainRulesOverloadGeneration.jl","page":"Introduction","title":"Operator Overloading AD with ChainRulesOverloadGeneration.jl","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The ChainRulesOverloadGeneration package provides a suite of methods for using ChainRulesCore.jl rules in operator overloaded based AD systems. It tracks what rules are defined at any point in time, and lets you trigger functions to which can use @eval in order to define the matching operator overloads.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The principal interface for using the operator overload generation method is on_new_rule. This function allows one to register a hook to be run every time a new rule is defined. The hook receives a signature type-type as input, and generally will use eval to define an overload of an AD system's overloaded type. For example, using the signature type Tuple{typeof(+), Real, Real} to make  +(::DualNumber, ::DualNumber) call the frule for +. A signature type tuple always has the form: Tuple{typeof(operation), typeof{pos_arg1}, typeof{pos_arg2}, ...}, where pos_arg1 is the first positional argument. One can dispatch on the signature type to make rules with argument types your AD does not support not call eval; or more simply you can just use conditions for this. For example if your AD only supports AbstractMatrix{Float64} and Float64 inputs you might write:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"const ACCEPT_TYPE = Union{Float64, AbstractMatrix{Float64}} \nfunction define_overload(sig::Type{<:Tuple{F, Vararg{ACCEPT_TYPE}}}) where F\n    @eval quote\n        # ...\n    end\nend\ndefine_overload(::Any) = nothing  # don't do anything for any other signature\n\non_new_rule(define_overload, frule)","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"or you might write:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"const ACCEPT_TYPES = (Float64, AbstractMatrix{Float64})\nfunction define_overload(sig)\n    sig = Base.unwrap_unionall(sig)  # not really handling most UnionAll,\n    opT, argTs = Iterators.peel(sig.parameters)\n    all(any(acceptT<: argT for acceptT in ACCEPT_TYPES) for argT in argTs) || return\n    @eval quote\n        # ...\n    end\nend\n\non_new_rule(define_overload, frule)","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The generation of overloaded code is the responsibility of the AD implementor. Packages like ExprTools.jl can be helpful for this. Its generally fairly simple, though can become complex if you need to handle complicated type-constraints. Examples are shown below.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The hook is automatically triggered whenever a package is loaded. It can also be triggers manually using refresh_rules(@ref). This is useful for example if new rules are define in the REPL, or if a package defining rules is modified. (Revise.jl will not automatically trigger). When the rules are refreshed (automatically or manually), the hooks are only triggered on new/modified rules; not ones that have already had the hooks triggered on.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"clear_new_rule_hooks!(@ref) clears all registered hooks. It is useful to undo [on_new_rule] hook registration if you are iteratively developing your overload generation function.","category":"page"}]
}
